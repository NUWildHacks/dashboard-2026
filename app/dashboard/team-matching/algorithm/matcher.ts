import { DEFAULT_TEAM_MATCHING_SETTINGS, type IntakeRecord, type MatchedTeam, type TeamMatchingRunWarning, type TeamMatchingSettings, type TeamMember } from "@/types";

import { generateProsCons, scoreTeam } from "./score";
import { UnionFind } from "./union-find";

const MAX_TEAM_SIZE = DEFAULT_TEAM_MATCHING_SETTINGS.default_team_size;
const TECH_ROLES = new Set(["Frontend Engineer", "Backend Engineer", "Full Stack Engineer", "Mobile Engineer"]);
// picks the best result by hard violations then soft score
const RESTARTS = 8;

export type AlgorithmResult = {
  teams: Omit<MatchedTeam, "id">[];
  unmatched: string[];
  warnings: TeamMatchingRunWarning[];
  fingerprint: string;
};

// Utilities 

// Seeded Fisher-Yates 
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = (seed ^ 0x9e3779b9) >>> 0;
  const rand = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const isTech = (r: IntakeRecord) => r.preferred_roles.some((role) => TECH_ROLES.has(role));

function splitsPair(team: IntakeRecord[], requiredWith: Map<string, string[]>): boolean {
  const ids = new Set(team.map((m) => m.user_id));
  return team.some((m) => (requiredWith.get(m.user_id) ?? []).some((id) => !ids.has(id)));
}

// HARD CONSTRAINTS
// Validates required-teammate edges and detects oversized clusters
// Returns { blocked: true } if an oversized cluster is found -> run can not proceed
// When enforce_mutual_requirement is false, warnings are still emitted but mutualEdges
// is returned empty so no clusters are locked
function preflight(
  intakes: IntakeRecord[],
  enforceRequiredTeammates: boolean
): {
  warnings: TeamMatchingRunWarning[];
  mutualEdges: [string, string][];
  blocked: boolean;
} {
  const warnings: TeamMatchingRunWarning[] = [];
  const pool = new Map(intakes.map((r) => [r.user_id, r]));
  const mutualEdges: [string, string][] = [];

  for (const intake of intakes) {
    for (const reqId of intake.required_teammates) {
      if (!pool.has(reqId)) {
        warnings.push({
          type: "missing_teammate",
          user_ids: [intake.user_id],
          message: `${intake.name} listed a required teammate who has not submitted the form. Requirement removed.`,
        });
      } else {
        const other = pool.get(reqId)!;
        if (!other.required_teammates.includes(intake.user_id)) {
          warnings.push({
            type: "missing_teammate",
            user_ids: [intake.user_id, reqId],
            message: `${intake.name} listed ${other.name} as required, but ${other.name} did not reciprocate. Requirement removed.`,
          });
        } else if (intake.user_id < reqId) {
          mutualEdges.push([intake.user_id, reqId]);
        }
      }
    }
  }

  // If not enforcing, skip cluster formation entirely
  if (!enforceRequiredTeammates) {
    return { warnings, mutualEdges: [], blocked: false };
  }

  let blocked = false;
  if (mutualEdges.length > 0) {
    const uf = new UnionFind(intakes.map((r) => r.user_id));
    for (const [a, b] of mutualEdges) uf.union(a, b);
    for (const [, members] of uf.getGroups()) {
      if (members.length > MAX_TEAM_SIZE) {
        warnings.push({
          type: "oversized_cluster",
          user_ids: members,
          message: `A required teammate group of ${members.length} people exceeds the maximum team size of ${MAX_TEAM_SIZE}. Run blocked — please resolve this manually.`,
        });
        blocked = true;
      }
    }
  }

  return { warnings, mutualEdges, blocked };
}

// ── SOFT CONSTRAINT: greedy best addition ──────────────────────────────────────
// Picks the single candidate from pool that maximises scoreTeam([...team, candidate]).
function pickBest(
  team: IntakeRecord[],
  pool: IntakeRecord[],
  settings: TeamMatchingSettings
): IntakeRecord | undefined {
  let best: IntakeRecord | undefined;
  let bestScore = -Infinity;
  for (const candidate of pool) {
    const s = scoreTeam([...team, candidate], settings);
    if (s > bestScore) {
      bestScore = s;
      best = candidate;
    }
  }
  return best;
}

// ── Greedy assignment (one restart) ───────────────────────────────────────────
// Hard: required-teammate clusters stay together; tech member grabbed first when possible.
// Soft: remaining spots filled by scoreTeam.
function greedyAssign(
  lockedClusters: string[][],
  singletons: IntakeRecord[],
  intakeMap: Map<string, IntakeRecord>,
  settings: TeamMatchingSettings,
  seed: number,
  enforceTech: boolean
): { teams: IntakeRecord[][]; unmatched: IntakeRecord[] } {
  const assigned = new Set<string>();
  const teams: IntakeRecord[][] = [];

  const pool = seededShuffle(singletons, seed);
  const available = () => pool.filter((r) => !assigned.has(r.user_id));

  // 1. Fill locked clusters first (hard: required teammates already together)
  for (const cluster of lockedClusters) {
    const clusterMembers = cluster.map((id) => intakeMap.get(id)!);
    cluster.forEach((id) => assigned.add(id));

    const spots = MAX_TEAM_SIZE - clusterMembers.length;
    const toAdd: IntakeRecord[] = [];

    if (spots > 0) {
      // Hard preference: if cluster has no tech member, grab one first
      if (enforceTech && !clusterMembers.some(isTech)) {
        const techFirst = available().find(isTech);
        if (techFirst) {
          toAdd.push(techFirst);
          assigned.add(techFirst.user_id);
        }
      }
      // Fill remaining by soft score
      for (let i = toAdd.length; i < spots; i++) {
        const best = pickBest([...clusterMembers, ...toAdd], available(), settings);
        if (!best) break;
        toAdd.push(best);
        assigned.add(best.user_id);
      }
    }

    teams.push([...clusterMembers, ...toAdd]);
  }

  // 2. Form new teams from remaining singletons
  const unmatched: IntakeRecord[] = [];
  const remainingPool = pool.filter((r) => !assigned.has(r.user_id));

  while (remainingPool.length >= 2) {
    const seedPerson = remainingPool.shift()!;
    assigned.add(seedPerson.user_id);

    // Avoid leaving exactly 1 person stranded
    let target = Math.min(MAX_TEAM_SIZE, remainingPool.length + 1);
    if (remainingPool.length - (target - 1) === 1 && target > 2) target--;

    const team: IntakeRecord[] = [seedPerson];

    // Hard preference: grab a tech member first if seed person has no tech role
    if (enforceTech && !isTech(seedPerson) && target > 1) {
      const techIdx = remainingPool.findIndex(isTech);
      if (techIdx >= 0) {
        const techMember = remainingPool.splice(techIdx, 1)[0];
        team.push(techMember);
        assigned.add(techMember.user_id);
      }
    }

    // Fill remaining by soft score
    while (team.length < target) {
      const avail = remainingPool.filter((r) => !assigned.has(r.user_id));
      if (avail.length === 0) break;
      const best = pickBest(team, avail, settings);
      if (!best) break;
      team.push(best);
      assigned.add(best.user_id);
      const idx = remainingPool.findIndex((r) => r.user_id === best.user_id);
      if (idx >= 0) remainingPool.splice(idx, 1);
    }

    teams.push(team);
  }

  if (remainingPool.length === 1) unmatched.push(remainingPool[0]);

  return { teams, unmatched };
}

// ── HARD CONSTRAINT repair: ≥1 tech member per team ───────────────────────────
// Attempts to fix tech-less teams by absorbing unmatched tech members or swapping
// with a team that has a surplus. Emits a warning only if repair is impossible.
function repairTechConstraint(
  teams: IntakeRecord[][],
  unmatched: IntakeRecord[],
  requiredWith: Map<string, string[]>
): { teams: IntakeRecord[][]; unmatched: IntakeRecord[]; warnings: TeamMatchingRunWarning[] } {
  const warnings: TeamMatchingRunWarning[] = [];

  // First: absorb any unmatched tech members into tech-less teams
  const absorbed = new Set<string>();
  for (const u of unmatched) {
    if (!isTech(u)) continue;
    const idx = teams.findIndex((t) => !t.some(isTech) && t.length < MAX_TEAM_SIZE);
    if (idx >= 0) {
      teams[idx] = [...teams[idx], u];
      absorbed.add(u.user_id);
    }
  }
  const remainingUnmatched = unmatched.filter((u) => !absorbed.has(u.user_id));

  // Then: swap a non-tech member out of tech-less team with a spare tech from another team
  for (let i = 0; i < teams.length; i++) {
    if (teams[i].some(isTech)) continue;

    let fixed = false;
    for (let j = 0; j < teams.length && !fixed; j++) {
      if (i === j) continue;
      const techInJ = teams[j].filter(isTech);
      if (techInJ.length < 2) continue; // can't give away their only tech member

      for (const tech of techInJ) {
        const jTechIdx = teams[j].findIndex((m) => m.user_id === tech.user_id);
        for (let mi = 0; mi < teams[i].length; mi++) {
          const nonTech = teams[i][mi];
          const newI = [...teams[i].slice(0, mi), tech, ...teams[i].slice(mi + 1)];
          const newJ = [...teams[j].slice(0, jTechIdx), nonTech, ...teams[j].slice(jTechIdx + 1)];

          if (!splitsPair(newI, requiredWith) && !splitsPair(newJ, requiredWith)) {
            teams[i] = newI;
            teams[j] = newJ;
            fixed = true;
            break;
          }
        }
        if (fixed) break;
      }
    }

    if (!fixed) {
      warnings.push({
        type: "no_technical_member",
        user_ids: teams[i].map((m) => m.user_id),
        message: `A team (${teams[i].map((m) => m.name).join(", ")}) has no technical member and could not be repaired automatically.`,
      });
    }
  }

  return { teams, unmatched: remainingUnmatched, warnings };
}

// ── SOFT CONSTRAINT: swap optimisation ────────────────────────────────────────
// Improves total soft score via pairwise member swaps.
// Never breaks hard constraints (required pairs, tech member coverage).
function swapOptimize(
  teams: IntakeRecord[][],
  unmatched: IntakeRecord[],
  settings: TeamMatchingSettings,
  requiredWith: Map<string, string[]>,
  enforceTech: boolean
): { teams: IntakeRecord[][]; unmatched: IntakeRecord[] } {
  for (let pass = 0; pass < 3; pass++) {
    let improved = false;

    outer: for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        for (let mi = 0; mi < teams[i].length; mi++) {
          for (let mj = 0; mj < teams[j].length; mj++) {
            const m1 = teams[i][mi];
            const m2 = teams[j][mj];
            const newT1 = [...teams[i].slice(0, mi), m2, ...teams[i].slice(mi + 1)];
            const newT2 = [...teams[j].slice(0, mj), m1, ...teams[j].slice(mj + 1)];

            // Hard: never split a required pair
            if (splitsPair(newT1, requiredWith) || splitsPair(newT2, requiredWith)) continue;
            // Hard: never leave a team without a tech member (when enforced)
            if (enforceTech && isTech(m1) && !newT1.some(isTech)) continue;
            if (enforceTech && isTech(m2) && !newT2.some(isTech)) continue;

            // Soft: only swap if it improves total score
            if (
              scoreTeam(newT1, settings) + scoreTeam(newT2, settings) >
              scoreTeam(teams[i], settings) + scoreTeam(teams[j], settings)
            ) {
              teams[i] = newT1;
              teams[j] = newT2;
              improved = true;
              break outer;
            }
          }
        }
      }
    }

    // Absorb unmatched into the best available team (soft score)
    const stillUnmatched: IntakeRecord[] = [];
    for (const u of unmatched) {
      let bestScore = -1;
      let bestIdx = -1;
      for (let i = 0; i < teams.length; i++) {
        if (teams[i].length >= MAX_TEAM_SIZE) continue;
        const s = scoreTeam([...teams[i], u], settings);
        if (s > bestScore) {
          bestScore = s;
          bestIdx = i;
        }
      }
      if (bestIdx >= 0) {
        teams[bestIdx] = [...teams[bestIdx], u];
        improved = true;
      } else {
        stillUnmatched.push(u);
      }
    }
    unmatched = stillUnmatched;

    if (!improved) break;
  }

  return { teams, unmatched };
}

function intakeToMember(intake: IntakeRecord): TeamMember {
  return {
    user_id: intake.user_id,
    name: intake.name,
    roles: intake.preferred_roles,
    skills: intake.skills,
    experience_level: intake.experience_level,
    work_style: intake.work_style,
    gender_preference: intake.gender_preference,
    where_staying: intake.where_staying,
  };
}

function candidateFingerprint(teams: IntakeRecord[][]): string {
  return teams
    .map((t) =>
      t
        .map((m) => m.user_id)
        .sort()
        .join(",")
    )
    .sort()
    .join("|");
}

function candidateToResult(
  candidate: { teams: IntakeRecord[][]; unmatched: IntakeRecord[]; repairWarnings: TeamMatchingRunWarning[] },
  preflightWarnings: TeamMatchingRunWarning[],
  settings: TeamMatchingSettings,
  whereToMeet: string
): AlgorithmResult {
  const fp = candidateFingerprint(candidate.teams);
  const teams: Omit<MatchedTeam, "id">[] = candidate.teams.map((members) => {
    const { pros, cons } = generateProsCons(members, settings);
    return {
      run_id: "",
      members: members.map(intakeToMember),
      score: Math.round(scoreTeam(members, settings)),
      match_reasons: pros,
      where_to_meet: whereToMeet,
      notes: cons,
    };
  });
  return {
    teams,
    unmatched: candidate.unmatched.map((r) => r.user_id),
    warnings: [...preflightWarnings, ...candidate.repairWarnings],
    fingerprint: fp,
  };
}

// ── Main export ────────────────────────────────────────────────────────────────
// Runs RESTARTS iterations with different seeds. Tracks the top 3 unique results
// (by fingerprint) ranked by: fewest hard violations, then highest soft score.
// Returns the best as the primary result plus up to 2 alternatives.
export function runMatchingAlgorithm(
  intakes: IntakeRecord[],
  settings: TeamMatchingSettings,
  whereToMeet: string,
  baseSeed = 0
): AlgorithmResult & { preflightFailed: boolean; alternatives: AlgorithmResult[] } {
  const enforceTech = settings.enforce_tech_member ?? true;
  const { warnings: preflightWarnings, mutualEdges, blocked } = preflight(intakes, settings.enforce_mutual_requirement);

  if (blocked) {
    return {
      teams: [],
      unmatched: [],
      warnings: preflightWarnings,
      fingerprint: "",
      preflightFailed: true,
      alternatives: [],
    };
  }

  const intakeMap = new Map(intakes.map((r) => [r.user_id, r]));

  // Lock required-teammate clusters (hard constraint)
  const uf = new UnionFind(intakes.map((r) => r.user_id));
  for (const [a, b] of mutualEdges) uf.union(a, b);

  const lockedClusters: string[][] = [];
  const singletons: IntakeRecord[] = [];
  for (const [, members] of uf.getGroups()) {
    if (members.length > 1) lockedClusters.push(members);
    else singletons.push(intakeMap.get(members[0])!);
  }

  const requiredWith = new Map<string, string[]>();
  for (const [a, b] of mutualEdges) {
    if (!requiredWith.has(a)) requiredWith.set(a, []);
    if (!requiredWith.has(b)) requiredWith.set(b, []);
    requiredWith.get(a)!.push(b);
    requiredWith.get(b)!.push(a);
  }

  type Candidate = {
    teams: IntakeRecord[][];
    unmatched: IntakeRecord[];
    hardViolations: number;
    softScore: number;
    repairWarnings: TeamMatchingRunWarning[];
    fingerprint: string;
  };

  const seen = new Set<string>();
  const topCandidates: Candidate[] = [];

  for (let r = 0; r < RESTARTS; r++) {
    // Spread restarts across seed space regardless of baseSeed value
    const seed = (baseSeed ^ (r * 0x9e3779b9)) >>> 0;

    const { teams, unmatched } = greedyAssign(lockedClusters, singletons, intakeMap, settings, seed, enforceTech);
    const {
      teams: repairedTeams,
      unmatched: repairedUnmatched,
      warnings: repairWarnings,
    } = enforceTech ? repairTechConstraint(teams, unmatched, requiredWith) : { teams, unmatched, warnings: [] };
    const { teams: optimizedTeams, unmatched: finalUnmatched } = swapOptimize(
      repairedTeams,
      repairedUnmatched,
      settings,
      requiredWith,
      enforceTech
    );

    const fp = candidateFingerprint(optimizedTeams);
    if (seen.has(fp)) continue;
    seen.add(fp);

    const hardViolations = repairWarnings.length;
    const softScore = optimizedTeams.reduce((sum, t) => sum + scoreTeam(t, settings), 0);

    topCandidates.push({
      teams: optimizedTeams,
      unmatched: finalUnmatched,
      hardViolations,
      softScore,
      repairWarnings,
      fingerprint: fp,
    });
    topCandidates.sort((a, b) =>
      a.hardViolations !== b.hardViolations ? a.hardViolations - b.hardViolations : b.softScore - a.softScore
    );
    if (topCandidates.length > 3) topCandidates.pop();
  }

  const [best, ...runnerUps] = topCandidates;

  const primaryResult = candidateToResult(best, preflightWarnings, settings, whereToMeet);
  const alternatives = runnerUps.map((c) => candidateToResult(c, preflightWarnings, settings, whereToMeet));

  return {
    ...primaryResult,
    preflightFailed: false,
    alternatives,
  };
}
