"use server";

import { getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

import {
  ADMIN,
  DASHBOARD_PATH,
  DASHBOARD_TEAM_MATCHING_PATH,
  LOGIN_PATH,
  TEAM_MATCHING_RUNS_COLLECTION,
  WILDHACKS_COLLECTION,
  WILDHACKS_CONFIG_DOC,
} from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { ActionResult } from "@/types";

export const publishRun = async (runId: string): Promise<ActionResult> => {
  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);
    const roleCheck = requireRole(user, ADMIN);
    if (roleCheck) return roleCheck;

    const db = getFirestore();
    const runRef = db.collection(TEAM_MATCHING_RUNS_COLLECTION).doc(runId);
    const runSnap = await runRef.get();

    if (!runSnap.exists) return { success: false, error: "Run not found." };
    if (runSnap.data()?.status !== "draft") return { success: false, error: "Only draft runs can be published." };

    const batch = db.batch();
    batch.update(runRef, { status: "published" });
    batch.update(db.collection(WILDHACKS_COLLECTION).doc(WILDHACKS_CONFIG_DOC), {
      active_matching_run_id: runId,
    });
    await batch.commit();

    revalidatePath(DASHBOARD_TEAM_MATCHING_PATH);
    revalidatePath(DASHBOARD_PATH);

    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: msg };
  }
};
