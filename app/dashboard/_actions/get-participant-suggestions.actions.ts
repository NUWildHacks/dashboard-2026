"use server";

import { getFirestore } from "firebase-admin/firestore";

import {
  DASHBOARD_PATH,
  LOGIN_PATH,
  TEAM_MATCHING_RUNS_COLLECTION,
  TEAM_MATCHING_SUGGESTIONS_COLLECTION,
} from "@/constants";
import { getAuthenticatedUser } from "@/lib";
import type { TeamMatchingRun, TeamSuggestion, UserSuggestions } from "@/types";

export const getParticipantSuggestions = async (): Promise<TeamSuggestion[]> => {
  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`;
    const { id: userId } = await getAuthenticatedUser(redirectPath);

    const db = getFirestore();

    const topRunsSnap = await db
      .collection(TEAM_MATCHING_RUNS_COLLECTION)
      .where("is_top", "==", true)
      .orderBy("run_at", "desc")
      .get();
    const topRuns = topRunsSnap.docs.map((d) => d.data() as TeamMatchingRun);

    const seen = new Set<string>();
    const suggestions: TeamSuggestion[] = [];

    for (const run of topRuns) {
      if (suggestions.length >= 3) break;
      const snap = await db
        .collection(TEAM_MATCHING_SUGGESTIONS_COLLECTION)
        .doc(`${run.id}_${userId}`)
        .get();
      if (!snap.exists) continue;
      const data = snap.data() as UserSuggestions;
      for (const s of data.suggestions) {
        if (suggestions.length >= 3) break;
        const key = s.members.map((m) => m.user_id).sort().join(",");
        if (!seen.has(key)) {
          seen.add(key);
          suggestions.push(s);
        }
      }
    }

    return suggestions;
  } catch {
    return [];
  }
};
