"use server";

import { getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

import { USERS_COLLECTION, LOGIN_PATH, DASHBOARD_SETTINGS_PATH } from "@/constants";
import { getAuthenticatedUser, getConfigDocSnapshot } from "@/lib";
import type { ActionResult, WildHacksConfig } from "@/types";

import {
  EditAdminProfileFormSchema,
  EditJudgeMentorProfileFormSchema,
  EditParticipantProfileFormSchema,
} from "../_schemas/edit-profile-form.schemas";

export type EditProfileResult<
  T extends EditParticipantProfileFormSchema | EditAdminProfileFormSchema | EditJudgeMentorProfileFormSchema,
> = ActionResult<T>;

export const editProfile = async <
  T extends EditParticipantProfileFormSchema | EditAdminProfileFormSchema | EditJudgeMentorProfileFormSchema,
>(
  data: T
): Promise<EditProfileResult<T>> => {
  const db = getFirestore();
  const now = Date.now();

  try {
    const configDocSnapshot = await getConfigDocSnapshot();
    const { end_time } = configDocSnapshot.data() as WildHacksConfig;

    if (now >= end_time) {
      return {
        success: false,
        error: "The event has ended",
      };
    }

    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_SETTINGS_PATH)}`;
    const { id: userId } = await getAuthenticatedUser(redirectPath);

    await db
      .collection(USERS_COLLECTION)
      .doc(userId)
      .update({
        ...data,
        updated_at: now,
      });

    revalidatePath(DASHBOARD_SETTINGS_PATH);

    return { success: true };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Edit profile error:", detailedError);

    const isProduction = process.env.APP_ENV === "production";
    const errorMessage = isProduction ? "An unknown error occurred. Please try again." : detailedError;

    return { success: false, error: errorMessage };
  }
};
