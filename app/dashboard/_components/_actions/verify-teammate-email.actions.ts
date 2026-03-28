"use server";

import { getFirestore } from "firebase-admin/firestore";

import { USERS_COLLECTION, LOGIN_PATH, DASHBOARD_PATH, PARTICIPANT } from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { ActionResult } from "@/types";

export type VerifyTeammateEmailResult = ActionResult & { name?: string };

export const verifyTeammateEmail = async (email: string): Promise<VerifyTeammateEmailResult> => {
  const db = getFirestore();

  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`;
    const caller = await getAuthenticatedUser(redirectPath);

    const roleCheck = requireRole(caller, PARTICIPANT);
    if (roleCheck) return roleCheck;

    const snapshot = await db
      .collection(USERS_COLLECTION)
      .where("email", "==", email.toLowerCase().trim())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return { success: false, error: "No registered participant found with this email." };
    }

    const user = snapshot.docs[0].data();
    return { success: true, name: `${user.first_name} ${user.last_name}` };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Teammate email verification error:", detailedError);
    return { success: false, error: "Could not verify email. Please try again." };
  }
};
