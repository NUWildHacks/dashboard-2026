import type { IntakeRecord, MatchedTeam, TeamMatchingRunWarning, TeamMatchingSettings, TeamMember, TeamSuggestion, UserSuggestions } from "@/types";

import { UnionFind } from "./union-find";
import { generateMatchReasons, hasTechnicalMember, scoreTeam } from "./score";

const MAX_TEAM_SIZE = 4;
const TOP_K = 10;

export type AlgorithmResult = {
  teams: Omit<MatchedTeam, "id">[];
  suggestions: Omit<UserSuggestions, "run_id">[];
  unmatched: string[];
  warnings: TeamMatchingRunWarning[];
};

// Pre-flight: validate requirements and detect oversized clusters.
// Returns { warnings, mutualEdges } — if any oversized cluster warning exists, caller should abort.
function preflight(intakes: IntakeRecord[]): {
  warnings: TeamMatchingRunWarning[];
  mutualEdges: [string, string][];
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
          // Only add each mutual edge once (use lexicographic ordering)
          mutualEdges.push([intake.user_id, reqId]);
        }
      }
    }
  }

  // Check for oversized clusters
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
      }
    }
  }

  return { warnings, mutualEdges };
}

// Compute pairwise compatibility matrix and top-k peers for each participant.
function buildCompatibilityGraph(
  intakes: IntakeRecord[],
  settings: TeamMatchingSettings
): Map<string, string[]> {
  const topK = new Map<string, string[]>();

  for (const a of intakes) {
    const scores: { id: string; score: number }[] = [];
    for (const b of intakes) {
      if (a.user_id === b.user_id) continue;
      scores.push({ id: b.user_id, score: scoreTeam([a, b], settings) });
    }
    scores.sort((x, y) => y.score - x.score);
    topK.set(
      a.user_id,
      scores.slice(0, TOP_K).map((s) => s.id)
    );
  }

  return topK;
}

// Greedily pick n candidates from the pool to add to currentMembers, maximising team score.
function pickBestAdditions(
  currentMembers: IntakeRecord[],
  pool: IntakeRecord[],
  n: number,
  settings: TeamMatchingSettings,
  topK: Map<string, string[]>
): IntakeRecord[] {
  const selected: IntakeRecord[] = [];
  const remaining = new Map(pool.map((r) => [r.user_id, r]));

  for (let i = 0; i < n; i++) {
    if (remaining.size === 0) break;

    // Prioritise top-k candidates from any current member
    const preferred = new Set(currentMembers.concat(selected).flatMap((m) => topK.get(m.user_id) ?? []));
    const candidates = [...remaining.values()].sort((a, b) => {
      const aPreferred = preferred.has(a.user_id) ? 1 : 0;
      const bPreferred = preferred.has(b.user_id) ? 1 : 0;
      if (aPreferred !== bPreferred) return bPreferred - aPreferred;
      const scoreA = scoreTeam([...currentMembers, ...selected, a], settings);
      const scoreB = scoreTeam([...currentMembers, ...selected, b], settings);
      return scoreB - scoreA;
    });

    const best = candidates[0];
    selected.push(best);
    remaining.delete(best.user_id);
  }

  return selected;
}

// Run 1-3 passes of local swap optimisation between teams.
function swapOptimize(
  teams: IntakeRecord[][],
  unmatched: IntakeRecord[],
  settings: TeamMatchingSettings
): { teams: IntakeRecord[][]; unmatched: IntakeRecord[] } {
  for (let pass = 0; pass < 3; pass++) {
    let improved = false;

    // Member swaps between teams
    outer: for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        for (let mi = 0; mi < teams[i].length; mi++) {
          for (let mj = 0; mj < teams[j].length; mj++) {
            const t1 = teams[i];
            const t2 = teams[j];
            const m1 = t1[mi];
            const m2 = t2[mj];

            const newT1 = [...t1.slice(0, mi), m2, ...t1.slice(mi + 1)];
            const newT2 = [...t2.slice(0, mj), m1, ...t2.slice(mj + 1)];

            if (
              scoreTeam(newT1, settings) + scoreTeam(newT2, settings) >
              scoreTeam(t1, settings) + scoreTeam(t2, settings)
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

    // Absorb unmatched into teams with room
    const stillUnmatched: IntakeRecord[] = [];
    for (const u of unmatched) {
      let absorbed = false;
      let bestScore = -1;
      let bestTeamIdx = -1;

      for (let i = 0; i < teams.length; i++) {
        if (teams[i].length >= MAX_TEAM_SIZE) continue;
        const s = scoreTeam([...teams[i], u], settings);
        if (s > bestScore) {
          bestScore = s;
          bestTeamIdx = i;
        }
      }

      if (bestTeamIdx >= 0 && bestScore > scoreTeam(teams[bestTeamIdx], settings)) {
        teams[bestTeamIdx] = [...teams[bestTeamIdx], u];
        improved = true;
        absorbed = true;
      }

      if (!absorbed) stillUnmatched.push(u);
    }

    unmatched = stillUnmatched;
    if (!improved) break;
  }

  return { teams, unmatched };
}

// Generate up to 3 diverse candidate suggestions for a user, all containing them from the start.
function generateSuggestions(
  userId: string,
  lockedGroup: string[],
  intakeMap: Map<string, IntakeRecord>,
  topK: Map<string, string[]>,
  settings: TeamMatchingSettings
): { members: IntakeRecord[]; score: number; match_reasons: string[] }[] {
  const locked = lockedGroup.map((id) => intakeMap.get(id)!);
  const peers = (topK.get(userId) ?? [])
    .filter((id) => !lockedGroup.includes(id))
    .map((id) => intakeMap.get(id))
    .filter((r): r is IntakeRecord => !!r);

  const candidates: { members: IntakeRecord[]; score: number }[] = [];

  for (const size of [4, 3, 2]) {
    const needed = size - locked.length;
    if (needed < 0) continue;

    if (needed === 0) {
      if (hasTechnicalMember(locked)) {
        candidates.push({ members: locked, score: scoreTeam(locked, settings) });
      }
      continue;
    }

    // Enumerate subsets of size `needed` from peers
    const subsets = getSubsets(peers, needed);
    for (const subset of subsets) {
      const group = [...locked, ...subset];
      if (!hasTechnicalMember(group)) continue;
      candidates.push({ members: group, score: scoreTeam(group, settings) });
    }
  }

  // Deduplicate by sorted member ID set
  const seen = new Set<string>();
  const unique = candidates.filter(({ members }) => {
    const key = members.map((m) => m.user_id).sort().join(",");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  unique.sort((a, b) => b.score - a.score);

  // Diversity filter: <75% overlap with any already-selected suggestion
  const selected: typeof unique = [];
  for (const candidate of unique) {
    if (selected.length >= 3) break;
    if (selected.length === 0) {
      selected.push(candidate);
      continue;
    }
    const maxOverlap = Math.max(
      ...selected.map((s) => {
        const intersection = candidate.members.filter((m) => s.members.some((sm) => sm.user_id === m.user_id)).length;
        return intersection / candidate.members.length;
      })
    );
    if (maxOverlap < 0.75) selected.push(candidate);
  }

  return selected.map((s) => ({
    ...s,
    match_reasons: generateMatchReasons(s.members, settings),
  }));
}

function getSubsets<T>(arr: T[], size: number): T[][] {
  if (size === 0) return [[]];
  if (arr.length < size) return [];
  const [first, ...rest] = arr;
  const withFirst = getSubsets(rest, size - 1).map((s) => [first, ...s]);
  const withoutFirst = getSubsets(rest, size);
  return [...withFirst, ...withoutFirst];
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

export function runMatchingAlgorithm(
  intakes: IntakeRecord[],
  settings: TeamMatchingSettings,
  whereToMeet: string
): AlgorithmResult & { preflightFailed: boolean } {
  const { warnings, mutualEdges } = preflight(intakes);

  if (warnings.some((w) => w.type === "oversized_cluster")) {
    return { teams: [], suggestions: [], unmatched: [], warnings, preflightFailed: true };
  }

  const intakeMap = new Map(intakes.map((r) => [r.user_id, r]));

  // Phase A: Lock mutual clusters
  const uf = new UnionFind(intakes.map((r) => r.user_id));
  for (const [a, b] of mutualEdges) uf.union(a, b);
  const groups = uf.getGroups();

  const lockedClusters: string[][] = [];
  const singletons: string[] = [];
  let requiredClusterCount = 0;

  for (const [, members] of groups) {
    if (members.length > 1) {
      lockedClusters.push(members);
      requiredClusterCount++;
    } else {
      singletons.push(members[0]);
    }
  }

  // Phase B: Pairwise compatibility
  const topK = buildCompatibilityGraph(intakes, settings);

  // Phase C: Greedy team formation
  const assigned = new Set<string>();
  const teamMemberLists: IntakeRecord[][] = [];

  // Sort unassigned singletons by experience DESC
  const expOrder = { experienced: 3, intermediate: 2, beginner: 1 };
  const sortedSingletons = [...singletons]
    .map((id) => intakeMap.get(id)!)
    .sort((a, b) => (expOrder[b.experience_level as keyof typeof expOrder] ?? 2) - (expOrder[a.experience_level as keyof typeof expOrder] ?? 2));

  const unassignedPool = [...sortedSingletons];

  // Fill locked clusters first
  for (const cluster of lockedClusters) {
    const clusterMembers = cluster.map((id) => intakeMap.get(id)!);
    cluster.forEach((id) => assigned.add(id));

    const spots = MAX_TEAM_SIZE - clusterMembers.length;
    if (spots > 0) {
      const available = unassignedPool.filter((r) => !assigned.has(r.user_id));
      const additions = pickBestAdditions(clusterMembers, available, spots, settings, topK);
      additions.forEach((r) => assigned.add(r.user_id));
      teamMemberLists.push([...clusterMembers, ...additions]);
    } else {
      teamMemberLists.push(clusterMembers);
    }
  }

  // Form new teams from remaining unassigned
  let unmatchedRecords: IntakeRecord[] = [];
  const remainingPool = unassignedPool.filter((r) => !assigned.has(r.user_id));

  while (remainingPool.length >= 2) {
    const seed = remainingPool.shift()!;
    assigned.add(seed.user_id);

    const target = Math.min(MAX_TEAM_SIZE, remainingPool.length + 1);
    const available = remainingPool.filter((r) => !assigned.has(r.user_id));
    const additions = pickBestAdditions([seed], available, target - 1, settings, topK);
    additions.forEach((r) => {
      assigned.add(r.user_id);
      const idx = remainingPool.findIndex((p) => p.user_id === r.user_id);
      if (idx >= 0) remainingPool.splice(idx, 1);
    });

    const team = [seed, ...additions];

    // Enforce at-least-1-technical
    if (!hasTechnicalMember(team)) {
      const techCandidate = remainingPool.find(
        (r) => !assigned.has(r.user_id) && r.preferred_roles.some((role) => ["Frontend Engineer", "Backend Engineer", "Full Stack Engineer", "Mobile Engineer"].includes(role))
      );
      if (techCandidate) {
        assigned.add(techCandidate.user_id);
        const idx = remainingPool.findIndex((p) => p.user_id === techCandidate.user_id);
        if (idx >= 0) remainingPool.splice(idx, 1);
        team.push(techCandidate);
      }
    }

    teamMemberLists.push(team);
  }

  if (remainingPool.length === 1 && !assigned.has(remainingPool[0].user_id)) {
    unmatchedRecords.push(remainingPool[0]);
  }

  // Phase D: Swap optimisation
  const { teams: optimizedTeams, unmatched: finalUnmatched } = swapOptimize(teamMemberLists, unmatchedRecords, settings);
  unmatchedRecords = finalUnmatched;

  // Post-flight: flag teams missing technical members
  const postFlightWarnings: TeamMatchingRunWarning[] = [];
  for (const team of optimizedTeams) {
    if (!hasTechnicalMember(team)) {
      postFlightWarnings.push({
        type: "no_technical_member",
        user_ids: team.map((m) => m.user_id),
        message: `A team (${team.map((m) => m.name).join(", ")}) has no technical member (Frontend/Backend/Full Stack/Mobile).`,
      });
    }
  }

  const allWarnings = [...warnings, ...postFlightWarnings];

  // Build MatchedTeam objects (without IDs — caller assigns those)
  const teams: Omit<MatchedTeam, "id">[] = optimizedTeams.map((members) => ({
    run_id: "",
    members: members.map(intakeToMember),
    score: Math.round(scoreTeam(members, settings)),
    match_reasons: generateMatchReasons(members, settings),
    where_to_meet: whereToMeet,
    notes: [],
  }));

  // Phase E: Generate suggestions per user
  const suggestions: Omit<UserSuggestions, "run_id">[] = [];

  for (const intake of intakes) {
    const lockedGroup = uf.getGroup(intake.user_id);
    const rawSuggestions = generateSuggestions(intake.user_id, lockedGroup, intakeMap, topK, settings);

    const teamSuggestions: TeamSuggestion[] = rawSuggestions.map((s, idx) => ({
      rank: (idx + 1) as 1 | 2 | 3,
      team_id: "",
      members: s.members.map(intakeToMember),
      score: Math.round(s.score),
      match_reasons: s.match_reasons,
      where_to_meet: whereToMeet,
    }));

    suggestions.push({
      user_id: intake.user_id,
      suggestions: teamSuggestions,
    });
  }

  return {
    teams,
    suggestions,
    unmatched: unmatchedRecords.map((r) => r.user_id),
    warnings: allWarnings,
    preflightFailed: false,
  };
}
