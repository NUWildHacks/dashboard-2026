"use server";

import { getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

import {
  ADMIN,
  DASHBOARD_PATH,
  LOGIN_PATH,
  TEAM_MATCHING_RUNS_COLLECTION,
  TEAM_MATCHING_RUNS_COLLECTION_PROD,
  WILDHACKS_COLLECTION,
  WILDHACKS_CONFIG_DOC,
} from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { ActionResult, TeamMatchingMode } from "@/types";

export const publishRun = async (runId: string, mode: TeamMatchingMode = "dev"): Promise<ActionResult> => {
  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);
    const roleCheck = requireRole(user, ADMIN);
    if (roleCheck) return roleCheck;

    const db = getFirestore();
    const collection = mode === "prod" ? TEAM_MATCHING_RUNS_COLLECTION_PROD : TEAM_MATCHING_RUNS_COLLECTION;
    const runRef = db.collection(collection).doc(runId);
    const runSnap = await runRef.get();

    if (!runSnap.exists) return { success: false, error: "Run not found." };
    if (runSnap.data()?.status !== "draft") return { success: false, error: "Only draft runs can be published." };

    const batch = db.batch();
    batch.update(runRef, { status: "published" });
    batch.update(db.collection(WILDHACKS_COLLECTION).doc(WILDHACKS_CONFIG_DOC), {
      active_matching_run_id: runId,
    });
    await batch.commit();

    revalidatePath(DASHBOARD_PATH);
    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: msg };
  }
};
