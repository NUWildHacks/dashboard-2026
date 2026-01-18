"use server";

import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import { USERS_COLLECTION, LOGIN_PATH, DASHBOARD_SETTINGS_PATH } from "@/constants";
import { getConfigDocSnapshot, verifySession } from "@/lib";
import { getUserDocSnapshot } from "@/lib/user.lib";
import type { ActionResult, WildHacksConfig } from "@/types";

import { type EditProfileFormSchema } from "../_schemas/edit-profile-form.schemas";

export type EditProfileResult = ActionResult<EditProfileFormSchema>;

export const editProfile = async (data: EditProfileFormSchema): Promise<EditProfileResult> => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_SETTINGS_PATH)}`);

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

    const userDocSnapshot = await getUserDocSnapshot(userId);
    if (!userDocSnapshot.exists) {
      return {
        success: false,
        error: "User document not found",
      };
    }

    const userDocRef = db.collection(USERS_COLLECTION).doc(userId);

    await userDocRef.update({
      ...data,
      updated_at: now,
    });

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Edit profile error:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
};
