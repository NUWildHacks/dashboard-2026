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
} from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { ActionResult, TeamMatchingMode } from "@/types";

export const deleteRun = async (runId: string, mode: TeamMatchingMode = "dev"): Promise<ActionResult> => {
  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);
    const roleCheck = requireRole(user, ADMIN);
    if (roleCheck) return roleCheck;

    const db = getFirestore();
    const runsCollection = mode === "prod" ? TEAM_MATCHING_RUNS_COLLECTION_PROD : TEAM_MATCHING_RUNS_COLLECTION;
    const teamsCollection = mode === "prod" ? TEAM_MATCHING_TEAMS_COLLECTION_PROD : TEAM_MATCHING_TEAMS_COLLECTION;
    const formationsCollection =
      mode === "prod" ? TEAM_MATCHING_FORMATIONS_COLLECTION_PROD : TEAM_MATCHING_FORMATIONS_COLLECTION;

    const runRef = db.collection(runsCollection).doc(runId);
    const runSnap = await runRef.get();

    if (!runSnap.exists) return { success: false, error: "Run not found." };
    if (runSnap.data()?.is_top === true) {
      return { success: false, error: "Cannot delete a run marked as top choice. Unmark it first." };
    }

    const teamsSnap = await db.collection(teamsCollection).where("run_id", "==", runId).get();

    const formationRefs = [1, 2].map((i) => db.collection(formationsCollection).doc(`${runId}_alt${i}`));

    const allRefs = [runRef, ...teamsSnap.docs.map((d) => d.ref), ...formationRefs];

    const CHUNK_SIZE = 400;
    for (let i = 0; i < allRefs.length; i += CHUNK_SIZE) {
      const batch = db.batch();
      for (const ref of allRefs.slice(i, i + CHUNK_SIZE)) batch.delete(ref);
      await batch.commit();
    }

    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: msg };
  }
};
