"use server";

import { getFirestore } from "firebase-admin/firestore";

import admin from "@/config/firebase-admin";
import { USERS_COLLECTION, DASHBOARD_SETTINGS_PATH, LOGIN_PATH } from "@/constants";
import { getAuthenticatedUser, getConfigDocSnapshot } from "@/lib";
import type { ActionResult, WildHacksConfig } from "@/types";

export type WithdrawEventResult = ActionResult;

export const withdrawEvent = async (): Promise<WithdrawEventResult> => {
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
    const user = await getAuthenticatedUser(redirectPath);
    const { id: userId } = user;

    await db.collection(USERS_COLLECTION).doc(userId).delete();

    await admin.auth().deleteUser(userId);

    return { success: true };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Withdraw event error:", detailedError);

    const isProduction = process.env.APP_ENV === "production";
    const errorMessage = isProduction ? "An unknown error occurred. Please try again." : detailedError;

    return { success: false, error: errorMessage };
  }
};
