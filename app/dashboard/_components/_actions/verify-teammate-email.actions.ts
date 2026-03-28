"use server";

import { getFirestore } from "firebase-admin/firestore";

import { USERS_COLLECTION } from "@/constants";
import type { ActionResult } from "@/types";

export type VerifyTeammateEmailResult = ActionResult & { name?: string };

export const verifyTeammateEmail = async (email: string): Promise<VerifyTeammateEmailResult> => {
  const db = getFirestore();

  try {
    const snapshot = await db.collection(USERS_COLLECTION).where("email", "==", email.toLowerCase().trim()).limit(1).get();

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
