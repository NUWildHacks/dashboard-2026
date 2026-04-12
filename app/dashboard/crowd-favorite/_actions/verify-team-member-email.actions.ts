"use server";

import { getFirestore } from "firebase-admin/firestore";

import { DASHBOARD_CROWD_FAVORITE_PATH, LOGIN_PATH, PARTICIPANT, USERS_COLLECTION } from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";

import { getCrowdFavoriteProjectForUser } from "../_lib";

type VerifyTeamMemberEmailResult =
  | { success: true; first_name: string; email: string }
  | { success: false; error: string };

const verifyTeamMemberEmail = async (email: string): Promise<VerifyTeamMemberEmailResult> => {
  const db = getFirestore();

  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_CROWD_FAVORITE_PATH)}`;
    const caller = await getAuthenticatedUser(redirectPath);

    const roleCheck = requireRole(caller, PARTICIPANT);
    if (roleCheck) return roleCheck as { success: false; error: string };

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return { success: false, error: "Email is required" };
    }

    if (caller.email.toLowerCase() === normalizedEmail) {
      return { success: false, error: "Do not add your own email as a teammate" };
    }

    const userDocSnapshots = await db.collection(USERS_COLLECTION).where("email", "==", normalizedEmail).limit(1).get();

    if (userDocSnapshots.empty) {
      return { success: false, error: "No participant found for this email" };
    }

    const member = userDocSnapshots.docs[0].data();

    if (member.role !== PARTICIPANT) {
      return { success: false, error: "Only participants can be added to crowd favorite teams" };
    }

    if (await getCrowdFavoriteProjectForUser(userDocSnapshots.docs[0].id)) {
      return { success: false, error: "This participant is already assigned to another crowd favorite project" };
    }

    if (!member.first_name) {
      return { success: false, error: "Participant profile is incomplete" };
    }

    return {
      success: true,
      first_name: member.first_name as string,
      email: normalizedEmail,
    };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Verify crowd favorite teammate email error:", detailedError);

    return { success: false, error: "Could not verify teammate email. Please try again." };
  }
};

export { verifyTeamMemberEmail };
export type { VerifyTeamMemberEmailResult };
