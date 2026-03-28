"use server";

import { getFirestore } from "firebase-admin/firestore";

import { TEAM_MATCHING_INTAKE_COLLECTION, LOGIN_PATH, DASHBOARD_PATH } from "@/constants";
import { getAuthenticatedUser } from "@/lib";
import type { ActionResult } from "@/types";

export type TeamMatchingIntakeData = {
  experience_level: string;
  preferred_roles: string[];
  skills: Record<string, number>;
  additional_notes: string;
  preferred_team_size: number;
  work_style: string;
  required_teammates: string[];
  consent: boolean;
};

export const submitTeamMatchingIntake = async (data: TeamMatchingIntakeData): Promise<ActionResult> => {
  const db = getFirestore();
  const now = Date.now();

  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`;
    const { id: userId } = await getAuthenticatedUser(redirectPath);

    if (!data.consent) {
      return { success: false, error: "You must consent to participate in team matching." };
    }

    const docRef = db.collection(TEAM_MATCHING_INTAKE_COLLECTION).doc(userId);
    const existing = await docRef.get();

    if (existing.exists) {
      return { success: false, error: "You have already submitted the team matching survey." };
    }

    await docRef.set({
      ...data,
      user_id: userId,
      created_at: now,
    });

    return { success: true };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Team matching intake error:", detailedError);

    const isProduction = process.env.APP_ENV === "production";
    const errorMessage = isProduction ? "An unknown error occurred. Please try again." : detailedError;

    return { success: false, error: errorMessage };
  }
};
