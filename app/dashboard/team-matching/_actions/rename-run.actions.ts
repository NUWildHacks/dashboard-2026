"use server";

import { getFirestore } from "firebase-admin/firestore";

import { ADMIN, DASHBOARD_PATH, LOGIN_PATH, TEAM_MATCHING_RUNS_COLLECTION } from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { ActionResult } from "@/types";

export const renameRun = async (runId: string, name: string): Promise<ActionResult> => {
  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);
    const roleCheck = requireRole(user, ADMIN);
    if (roleCheck) return roleCheck;

    const trimmed = name.trim();
    if (!trimmed) return { success: false, error: "Name cannot be empty." };

    const db = getFirestore();
    const ref = db.collection(TEAM_MATCHING_RUNS_COLLECTION).doc(runId);
    const snap = await ref.get();
    if (!snap.exists) return { success: false, error: "Run not found." };

    await ref.update({ name: trimmed });
    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: msg };
  }
};
