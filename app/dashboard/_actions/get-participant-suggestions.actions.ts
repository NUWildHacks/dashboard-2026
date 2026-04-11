"use server";

import { getFirestore } from "firebase-admin/firestore";

import {
  ADMIN,
  DASHBOARD_PATH,
  LOGIN_PATH,
  TEAM_MATCHING_FORMATIONS_COLLECTION,
  TEAM_MATCHING_FORMATIONS_COLLECTION_PROD,
  TEAM_MATCHING_RUNS_COLLECTION,
  TEAM_MATCHING_RUNS_COLLECTION_PROD,
  TEAM_MATCHING_TEAMS_COLLECTION,
  TEAM_MATCHING_TEAMS_COLLECTION_PROD,
  WILDHACKS_COLLECTION,
  WILDHACKS_CONFIG_DOC,
} from "@/constants";
import { getAuthenticatedUser } from "@/lib";
import type { MatchedTeam, TeamFormation, TeamMatchingRun, TeamSuggestion, WildHacksConfig } from "@/types";

export const getParticipantSuggestions = async (): Promise<TeamSuggestion[]> => {
  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`;
    const { id: userId, role } = await getAuthenticatedUser(redirectPath);

    const db = getFirestore();

    const configSnap = await db.collection(WILDHACKS_COLLECTION).doc(WILDHACKS_CONFIG_DOC).get();
    const mode = (configSnap.data() as WildHacksConfig | undefined)?.team_matching_mode ?? "dev";
    const effectiveMode = role === ADMIN ? mode : "prod";

    const runsCollection =
      effectiveMode === "prod" ? TEAM_MATCHING_RUNS_COLLECTION_PROD : TEAM_MATCHING_RUNS_COLLECTION;
    const teamsCollection =
      effectiveMode === "prod" ? TEAM_MATCHING_TEAMS_COLLECTION_PROD : TEAM_MATCHING_TEAMS_COLLECTION;
    const formationsCollection =
      effectiveMode === "prod" ? TEAM_MATCHING_FORMATIONS_COLLECTION_PROD : TEAM_MATCHING_FORMATIONS_COLLECTION;

    const topRunsSnap = await db.collection(runsCollection).where("is_top", "==", true).orderBy("run_at", "desc").get();
    const topRuns = topRunsSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as TeamMatchingRun);

    const results: TeamSuggestion[] = [];
    const seen = new Set<string>();

    const tryAdd = (team: MatchedTeam & { id: string }) => {
      if (results.length >= 3) return;
      const key = team.members
        .map((m) => m.user_id)
        .sort()
        .join(",");
      if (seen.has(key)) return;
      seen.add(key);
      results.push({
        rank: (results.length + 1) as 1 | 2 | 3,
        team_id: team.id,
        members: team.members,
        score: team.score,
        match_reasons: team.match_reasons,
        where_to_meet: team.where_to_meet,
      });
    };

    for (const run of topRuns) {
      if (results.length >= 3) break;

      // Primary formation
      const teamsSnap = await db.collection(teamsCollection).where("run_id", "==", run.id).get();
      const primary = teamsSnap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as MatchedTeam)
        .find((t) => t.members.some((m) => m.user_id === userId));
      if (primary) tryAdd(primary);

      if (results.length >= 3) break;

      // Alternative formations (alt1, alt2)
      const altDocs = await Promise.all(
        [1, 2].map((i) => db.collection(formationsCollection).doc(`${run.id}_alt${i}`).get())
      );
      for (const altDoc of altDocs) {
        if (!altDoc.exists || results.length >= 3) continue;
        const formation = altDoc.data() as TeamFormation;
        const altTeam = formation.teams.find((t) => t.members.some((m) => m.user_id === userId));
        if (altTeam) tryAdd(altTeam);
      }
    }

    return results;
  } catch {
    return [];
  }
};
