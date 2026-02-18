"use server";

import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import { USERS_COLLECTION, LOGIN_PATH, PARTICIPANT, ADMIN, JUDGE, REGISTRATION_PATH, MENTOR } from "@/constants";
import type { ActionResult, User } from "@/types";

import { verifySession } from ".";

/**
 * Get the authenticated user data.
 * Verifies the session and retrieves the user document from Firestore.
 * Redirects to login if session is invalid, or to registration if user document doesn't exist.
 *
 * @param redirectPath - Optional path to redirect to if session is invalid (defaults to LOGIN_PATH)
 * @returns Promise resolving to the authenticated user object
 * @throws {Redirect} Always redirects if session is invalid or user document doesn't exist
 * @example
 * ```ts
 * const user = await getAuthenticatedUser();
 * console.log(user.email, user.role);
 * // User is guaranteed to be authenticated and exist in database
 * ```
 */
const getAuthenticatedUser = async (redirectPath?: string): Promise<User> => {
  const userInfo = await verifySession();
  if (!userInfo) {
    const path = redirectPath || LOGIN_PATH;
    redirect(path);
  }

  const { id } = userInfo;

  const db = getFirestore();

  const userDocSnapshot = await db.collection(USERS_COLLECTION).doc(userInfo.id).get();
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  return { ...userDocSnapshot.data(), id } as User;
};

/**
 * Require a specific role for an action.
 * Validates that the user has the required role and returns an error result if they don't.
 *
 * @param user - The user data to check
 * @param requiredRole - The required role (PARTICIPANT, ADMIN, or JUDGE)
 * @param errorMessage - Optional custom error message (uses default message if not provided)
 * @returns ActionResult with success: false and error message if role doesn't match, null if authorized
 * @example
 * ```ts
 * const user = await getAuthenticatedUser();
 * const roleCheck = requireRole(user, ADMIN);
 * if (roleCheck) {
 *   return roleCheck; // User is not an admin
 * }
 * // User has required role, proceed with action
 * ```
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
      [MENTOR]: "You must be a mentor to perform this action",
    };

    return {
      success: false,
      error: errorMessage || defaultMessages[requiredRole],
    };
  }

  return null;
};

export { getAuthenticatedUser, requireRole };
