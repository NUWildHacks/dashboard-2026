"use server";

import { getFirestore } from "firebase-admin/firestore";
import { ADMIN, DASHBOARD_PATH, LOGIN_PATH, TEAM_MATCHING_SETTINGS_DOC, WILDHACKS_COLLECTION } from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { ActionResult, TeamMatchingSettings } from "@/types";

export type SaveSettingsData = Omit<TeamMatchingSettings, "updated_at">;

export const saveSettings = async (data: SaveSettingsData): Promise<ActionResult> => {
  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);
    const roleCheck = requireRole(user, ADMIN);
    if (roleCheck) return roleCheck;

    const totalWeight =
      data.weight_role_diversity +
      data.weight_work_style +
      data.weight_skills_complementarity +
      data.weight_experience_mix +
      data.weight_gender_preference +
      data.weight_proximity +
      data.weight_size_preference;

    if (Math.abs(totalWeight - 1.0) > 0.01) {
      return { success: false, error: `Weights must sum to 1.0 (currently ${totalWeight.toFixed(3)}).` };
    }

    const db = getFirestore();
    await db
      .collection(WILDHACKS_COLLECTION)
      .doc(TEAM_MATCHING_SETTINGS_DOC)
      .set({ ...data, updated_at: Date.now() });

    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: msg };
  }
};
