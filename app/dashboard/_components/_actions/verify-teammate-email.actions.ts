"use server";

import { getFirestore } from "firebase-admin/firestore";

import { USERS_COLLECTION, LOGIN_PATH, DASHBOARD_PATH, ADMIN } from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";

export type VerifyTeammateEmailResult =
  | { success: true; name: string; userId: string }
  | { success: false; error: string };

export const verifyTeammateEmail = async (email: string): Promise<VerifyTeammateEmailResult> => {
  const db = getFirestore();

  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`;
    const caller = await getAuthenticatedUser(redirectPath);

    // const roleCheck = requireRole(caller, PARTICIPANT);
    const roleCheck = requireRole(caller, ADMIN);
    if (roleCheck) return roleCheck as { success: false; error: string };

    const snapshot = await db
      .collection(USERS_COLLECTION)
      .where("email", "==", email.toLowerCase().trim())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return { success: false, error: "No registered participant found with this email." };
    }

    const doc = snapshot.docs[0];
    return { success: true, name: doc.data().first_name as string, userId: doc.id };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Teammate email verification error:", detailedError);
    return { success: false, error: "Could not verify email. Please try again." };
  }
};
