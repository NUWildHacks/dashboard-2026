"use server";

import { getFirestore, FirebaseFirestoreError } from "firebase-admin/firestore";

import { USERS_COLLECTION, LOGIN_PATH, DASHBOARD_SETTINGS_PATH } from "@/constants";
import { getAuthenticatedUser, getConfigDocSnapshot } from "@/lib";
import type { ActionResult, WildHacksConfig } from "@/types";

import { type EditProfileFormSchema } from "../_schemas/edit-profile-form.schemas";

export type EditProfileResult = ActionResult<EditProfileFormSchema>;

export const editProfile = async (data: EditProfileFormSchema): Promise<EditProfileResult> => {
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

    return { success: true };
  } catch (error) {
    let errorMessage;
    if (error instanceof FirebaseFirestoreError || error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "An unknown error occurred";
    }

    console.error("Edit profile error:", errorMessage);

    return { success: false, error: errorMessage };
  }
};
