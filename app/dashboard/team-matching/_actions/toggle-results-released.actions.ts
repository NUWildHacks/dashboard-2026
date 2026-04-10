"use server";

import { getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

import { ADMIN, DASHBOARD_PATH, LOGIN_PATH, WILDHACKS_COLLECTION, WILDHACKS_CONFIG_DOC } from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { ActionResult, TeamMatchingMode } from "@/types";

// Dev mode: sets results_released_dev (only admins see this; participants are unaffected).
// Prod mode: sets results_released (participants see results via the real-time listener).
export const setResultsReleased = async (released: boolean, mode: TeamMatchingMode): Promise<ActionResult> => {
  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);
    const roleCheck = requireRole(user, ADMIN);
    if (roleCheck) return roleCheck;

    const db = getFirestore();
    const field = mode === "prod" ? "results_released" : "results_released_dev";
    await db
      .collection(WILDHACKS_COLLECTION)
      .doc(WILDHACKS_CONFIG_DOC)
      .update({
        [field]: released,
      });

    // Only revalidate the participant-facing page in prod mode.
    if (mode === "prod") revalidatePath(DASHBOARD_PATH);
    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: msg };
  }
};
