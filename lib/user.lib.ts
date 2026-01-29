"use server";

import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import { USERS_COLLECTION, LOGIN_PATH, PARTICIPANT, ADMIN, JUDGE, REGISTRATION_PATH } from "@/constants";
import type { ActionResult, User } from "@/types";

import { verifySession } from ".";

/**
 * Get the authenticated user data.
 * Verifies the session and retrieves the user document.
 *
 * @param redirectPath - Optional path to redirect to if session is invalid
 * @returns Promise resolving to the user (redirects if user doesn't exist)
 */
const getAuthenticatedUser = async (redirectPath?: string): Promise<User> => {
  const userId = await verifySession();
  if (!userId) {
    const path = redirectPath || LOGIN_PATH;
    redirect(path);
  }

  const db = getFirestore();

  const userDocSnapshot = await db.collection(USERS_COLLECTION).doc(userId).get();
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  return { ...(userDocSnapshot.data() as User), id: userId } as User;
};

/**
 * Require a specific role for an action.
 * Returns an error result if the user doesn't have the required role.
 *
 * @param user - The user data
 * @param requiredRole - The required role (PARTICIPANT, ADMIN, or JUDGE)
 * @param errorMessage - Custom error message (optional)
 * @returns Error result if role doesn't match, null if authorized
 */
const requireRole = <T extends User["role"]>(
  user: User,
  requiredRole: T,
  errorMessage?: string
): ActionResult | null => {
  if (user.role !== requiredRole) {
    const defaultMessages: Record<User["role"], string> = {
      [PARTICIPANT]: "You must be a participant to perform this action",
      [ADMIN]: "You must be an administrator to perform this action",
      [JUDGE]: "You must be a judge to perform this action",
    };

    return {
      success: false,
      error: errorMessage || defaultMessages[user.role],
    };
  }

  return null;
};

export { getAuthenticatedUser, requireRole };
