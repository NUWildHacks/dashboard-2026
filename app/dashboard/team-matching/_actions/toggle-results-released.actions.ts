"use server";

import { getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

import {
  ADMIN,
  DASHBOARD_PATH,
  DASHBOARD_TEAM_MATCHING_PATH,
  LOGIN_PATH,
  WILDHACKS_COLLECTION,
  WILDHACKS_CONFIG_DOC,
} from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { ActionResult } from "@/types";

export const setResultsReleased = async (released: boolean): Promise<ActionResult> => {
  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);
    const roleCheck = requireRole(user, ADMIN);
    if (roleCheck) return roleCheck;

    const db = getFirestore();
    await db.collection(WILDHACKS_COLLECTION).doc(WILDHACKS_CONFIG_DOC).update({
      results_released: released,
    });

    revalidatePath(DASHBOARD_TEAM_MATCHING_PATH);
    revalidatePath(DASHBOARD_PATH);
    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: msg };
  }
};
