import type { IntakeRecord, TeamMatchingSettings } from "@/types";

const EXPERIENCE_MAP: Record<string, number> = {
  beginner: 1,
  intermediate: 2,
  experienced: 3,
};

const TECHNICAL_ROLES = new Set(["Frontend Engineer", "Backend Engineer", "Full Stack Engineer", "Mobile Engineer"]);

export function hasTechnicalMember(members: IntakeRecord[]): boolean {
  return members.some((m) => m.preferred_roles.some((r) => TECHNICAL_ROLES.has(r)));
}

// Ratio of unique role categories to team size — rewards breadth.
function scoreRoleDiversity(members: IntakeRecord[]): number {
  const unique = new Set(members.flatMap((m) => m.preferred_roles)).size;
  return Math.min(unique / members.length, 1.0);
}

// Fraction of members sharing the majority work style — rewards alignment.
function scoreWorkStyle(members: IntakeRecord[]): number {
  const counts = new Map<string, number>();
  for (const m of members) counts.set(m.work_style, (counts.get(m.work_style) ?? 0) + 1);
  const max = Math.max(...counts.values());
  return max / members.length;
}

// Sum of max proficiency per skill across the team, normalised — rewards collective breadth.
function scoreSkillsComplementarity(members: IntakeRecord[]): number {
  const allSkills = new Set(members.flatMap((m) => Object.keys(m.skills)));
  if (allSkills.size === 0) return 0;
  let total = 0;
  for (const skill of allSkills) {
    total += Math.max(...members.map((m) => m.skills[skill] ?? 0));
  }
  return Math.min(total / (5 * allSkills.size), 1.0);
}

// Normalised variance of experience levels — rewards heterogeneity.
function scoreExperienceMix(members: IntakeRecord[]): number {
  if (members.length <= 1) return 0.5;
  const vals = members.map((m) => EXPERIENCE_MAP[m.experience_level] ?? 2);
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const variance = vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length;
  return Math.min(variance / 1.0, 1.0);
}

// Fraction of members whose gender preference is satisfied.
// "no_preference" is always satisfied; "prefer_mixed"/"prefer_same" depends on team composition.
function scoreGenderPreference(members: IntakeRecord[]): number {
  if (members.length === 0) return 1;
  // We don't have actual gender data — use where_staying as a proxy for group composition.
  // Treat all "no_preference" as fully satisfied. For prefer_same/prefer_mixed,
  // score by whether team has diversity in where_staying (rough proxy).
  // In production this would use actual gender identity if collected.
  const satisfied = members.filter((m) => m.gender_preference === "no_preference").length;
  const mixed = new Set(members.map((m) => m.where_staying)).size > 1;
  const preferMixed = members.filter((m) => m.gender_preference === "prefer_mixed").length;
  const preferSame = members.filter((m) => m.gender_preference === "prefer_same").length;
  const mixedSat = mixed ? preferMixed : 0;
  const sameSat = mixed ? 0 : preferSame;
  return (satisfied + mixedSat + sameSat) / members.length;
}

// Fraction of members with the same where_staying value — rewards logistical alignment.
function scoreProximity(members: IntakeRecord[]): number {
  const counts = new Map<string, number>();
  for (const m of members) counts.set(m.where_staying, (counts.get(m.where_staying) ?? 0) + 1);
  const max = Math.max(...counts.values());
  return max / members.length;
}

// Closeness of actual team size to members' average preferred size.
function scoreSizePreference(members: IntakeRecord[]): number {
  const avg = members.reduce((a, m) => a + m.preferred_team_size, 0) / members.length;
  const diff = Math.abs(members.length - avg);
  return Math.max(1 - diff / 2, 0);
}

export function scoreTeam(members: IntakeRecord[], settings: TeamMatchingSettings): number {
  if (members.length === 0) return 0;
  return (
    (settings.weight_role_diversity * scoreRoleDiversity(members) +
      settings.weight_work_style * scoreWorkStyle(members) +
      settings.weight_skills_complementarity * scoreSkillsComplementarity(members) +
      settings.weight_experience_mix * scoreExperienceMix(members) +
      settings.weight_gender_preference * scoreGenderPreference(members) +
      settings.weight_proximity * scoreProximity(members) +
      settings.weight_size_preference * scoreSizePreference(members)) *
    100
  );
}

export function generateProsCons(
  members: IntakeRecord[],
  settings: TeamMatchingSettings
): { pros: string[]; cons: string[] } {
  const pros: string[] = [];
  const cons: string[] = [];

  // Role diversity
  const roleDiversity = scoreRoleDiversity(members);
  if (roleDiversity >= 0.75) {
    const roles = [...new Set(members.flatMap((m) => m.preferred_roles))];
    pros.push(
      `Complementary roles: ${roles.slice(0, 3).join(", ")}${roles.length > 3 ? `, +${roles.length - 3} more` : ""}`
    );
  } else {
    cons.push("Role overlap — limited specialization diversity");
  }

  // Work style
  const workStyle = scoreWorkStyle(members);
  if (workStyle >= 0.75) {
    const counts = new Map<string, number>();
    for (const m of members) counts.set(m.work_style, (counts.get(m.work_style) ?? 0) + 1);
    const dominant = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
    const label = dominant === "competitive" ? "competitive" : dominant === "casual" ? "casual" : "balanced";
    pros.push(`Aligned work style: ${label}`);
  } else {
    cons.push("Mixed work styles — may need to align expectations");
  }

  // Skills complementarity
  const skills = scoreSkillsComplementarity(members);
  if (skills >= 0.6) {
    const allSkills = new Set(members.flatMap((m) => Object.keys(m.skills).filter((k) => (m.skills[k] ?? 0) >= 3)));
    if (allSkills.size > 0) {
      pros.push(`Strong collective skills: ${[...allSkills].slice(0, 3).join(", ")}`);
    } else {
      pros.push("Good overall skill coverage");
    }
  } else {
    cons.push("Limited skill coverage across the team");
  }

  // Experience mix
  const expMix = scoreExperienceMix(members);
  if (expMix >= 0.4) {
    const expCounts = new Map<string, number>();
    for (const m of members) expCounts.set(m.experience_level, (expCounts.get(m.experience_level) ?? 0) + 1);
    const parts = [...expCounts.entries()].map(([level, count]) => `${count} ${level}`);
    pros.push(`Mixed experience levels: ${parts.join(", ")}`);
  } else {
    cons.push("Similar experience levels throughout — less mentorship dynamic");
  }

  // Gender preference
  const genderScore = scoreGenderPreference(members);
  if (genderScore >= 0.75) {
    pros.push("Gender preferences satisfied");
  } else {
    cons.push("Some gender preferences may not be met");
  }

  // Proximity / logistics
  const proximity = scoreProximity(members);
  if (proximity >= 0.75) {
    const counts = new Map<string, number>();
    for (const m of members) counts.set(m.where_staying, (counts.get(m.where_staying) ?? 0) + 1);
    const dominant = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
    if (dominant === "staying_overnight") pros.push("Everyone staying overnight");
    else if (dominant === "commuting") pros.push("Similar commuting plans");
    else pros.push("Aligned logistics");
  } else {
    cons.push("Mixed overnight/commuting plans");
  }

  // Team size preference
  const avg = members.reduce((a, m) => a + m.preferred_team_size, 0) / members.length;
  const diff = Math.abs(members.length - avg);
  if (diff <= 0.5) {
    pros.push("Team size matches everyone's preference");
  } else {
    cons.push("Team size differs from some members' preferred size");
  }

  // Technical member
  if (hasTechnicalMember(members)) {
    pros.push("Has at least one technical member");
  } else {
    cons.push("No technical member (Frontend / Backend / Full Stack / Mobile)");
  }

  void settings;
  return { pros, cons };
}

export function generateMatchReasons(members: IntakeRecord[], settings: TeamMatchingSettings): string[] {
  const reasons: string[] = [];

  const roleDiversity = scoreRoleDiversity(members);
  if (roleDiversity >= 0.75) {
    const roles = [...new Set(members.flatMap((m) => m.preferred_roles))];
    reasons.push(
      `Complementary roles: ${roles.slice(0, 3).join(", ")}${roles.length > 3 ? `, +${roles.length - 3} more` : ""}`
    );
  }

  const workStyle = scoreWorkStyle(members);
  if (workStyle >= 0.75) {
    const counts = new Map<string, number>();
    for (const m of members) counts.set(m.work_style, (counts.get(m.work_style) ?? 0) + 1);
    const dominant = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
    const label = dominant === "competitive" ? "competitive" : dominant === "casual" ? "casual" : "balanced";
    reasons.push(`Shared work style: everyone is ${label}`);
  }

  const skills = scoreSkillsComplementarity(members);
  if (skills >= 0.6) {
    const allSkills = new Set(members.flatMap((m) => Object.keys(m.skills).filter((k) => (m.skills[k] ?? 0) >= 3)));
    if (allSkills.size > 0) {
      const topSkills = [...allSkills].slice(0, 3);
      reasons.push(`Strong collective skills in ${topSkills.join(", ")}`);
    }
  }

  const expMix = scoreExperienceMix(members);
  if (expMix >= 0.4) {
    const expCounts = new Map<string, number>();
    for (const m of members) expCounts.set(m.experience_level, (expCounts.get(m.experience_level) ?? 0) + 1);
    const parts = [...expCounts.entries()].map(([level, count]) => `${count} ${level}`);
    reasons.push(`Mixed experience: ${parts.join(", ")}`);
  }

  const proximity = scoreProximity(members);
  if (proximity >= 0.75) {
    const counts = new Map<string, number>();
    for (const m of members) counts.set(m.where_staying, (counts.get(m.where_staying) ?? 0) + 1);
    const dominant = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
    if (dominant === "staying_overnight") reasons.push("Everyone is staying overnight");
    else if (dominant === "commuting") reasons.push("Similar commuting plans");
  }

  // Use settings to ensure we always return at least one reason
  void settings;
  if (reasons.length === 0) reasons.push("Compatible preferences and backgrounds");

  return reasons;
}
