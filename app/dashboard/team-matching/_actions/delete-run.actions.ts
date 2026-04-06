"use server";

import { getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

import {
  ADMIN,
  DASHBOARD_PATH,
  DASHBOARD_TEAM_MATCHING_PATH,
  LOGIN_PATH,
  TEAM_MATCHING_RUNS_COLLECTION,
  TEAM_MATCHING_SUGGESTIONS_COLLECTION,
  TEAM_MATCHING_TEAMS_COLLECTION,
} from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { ActionResult } from "@/types";

export const deleteRun = async (runId: string): Promise<ActionResult> => {
  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);
    const roleCheck = requireRole(user, ADMIN);
    if (roleCheck) return roleCheck;

    const db = getFirestore();
    const runRef = db.collection(TEAM_MATCHING_RUNS_COLLECTION).doc(runId);
    const runSnap = await runRef.get();

    if (!runSnap.exists) return { success: false, error: "Run not found." };
    if (runSnap.data()?.status === "published") {
      return { success: false, error: "Cannot delete a published run." };
    }

    // Collect all team docs for this run
    const teamsSnap = await db.collection(TEAM_MATCHING_TEAMS_COLLECTION).where("run_id", "==", runId).get();
    // Collect all suggestion docs for this run
    const suggestionsSnap = await db.collection(TEAM_MATCHING_SUGGESTIONS_COLLECTION).where("run_id", "==", runId).get();

    const allRefs = [
      runRef,
      ...teamsSnap.docs.map((d) => d.ref),
      ...suggestionsSnap.docs.map((d) => d.ref),
    ];

    // Delete in chunks of 400
    const CHUNK_SIZE = 400;
    for (let i = 0; i < allRefs.length; i += CHUNK_SIZE) {
      const batch = db.batch();
      for (const ref of allRefs.slice(i, i + CHUNK_SIZE)) {
        batch.delete(ref);
      }
      await batch.commit();
    }

    revalidatePath(DASHBOARD_TEAM_MATCHING_PATH);
    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: msg };
  }
};
