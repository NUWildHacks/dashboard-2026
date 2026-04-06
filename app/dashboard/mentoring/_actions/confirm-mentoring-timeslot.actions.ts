"use server";

import { getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

import {
  DASHBOARD_MENTORING_PATH,
  JUDGE_AND_MENTOR,
  LOGIN_PATH,
  MENTORING_TIMESLOTS,
  USERS_COLLECTION,
} from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { ActionResult, MentoringTimeslot } from "@/types";

import { TIMESLOT_CONFIRMATION_DEADLINE } from "../constants";

export type ConfirmMentoringTimeslotResult = ActionResult;

export const confirmMentoringTimeslot = async (
  selectedMentoringTimeslot: MentoringTimeslot
): Promise<ConfirmMentoringTimeslotResult> => {
  const db = getFirestore();
  const now = Date.now();

  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_MENTORING_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);

    const roleError = requireRole(user, JUDGE_AND_MENTOR, "You are not authorized to select a mentoring timeslot");
    if (roleError) return roleError;

    if (now > TIMESLOT_CONFIRMATION_DEADLINE) {
      return { success: false, error: "The timeslot confirmation deadline has passed." };
    }

    if (!(MENTORING_TIMESLOTS as readonly string[]).includes(selectedMentoringTimeslot)) {
      return { success: false, error: "Invalid mentoring timeslot selected." };
    }

    await db.collection(USERS_COLLECTION).doc(user.id).update({
      mentoring_timeslot: selectedMentoringTimeslot,
      updated_at: now,
    });

    revalidatePath(DASHBOARD_MENTORING_PATH);

    return { success: true };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Confirm mentoring timeslot error:", detailedError);

    const isProduction = process.env.APP_ENV === "production";
    const errorMessage = isProduction ? "An unknown error occurred. Please try again." : detailedError;

    return { success: false, error: errorMessage };
  }
};
