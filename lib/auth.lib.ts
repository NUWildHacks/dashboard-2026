"use server";

import { FirebaseAppError } from "firebase-admin/app";
import type { UserRecord } from "firebase-admin/auth";

import firebaseAdmin from "@/config/firebase-admin";
import { USER_NOT_FOUND } from "@/constants";

/**
 * Find a Firebase user by email address.
 * Uses Firebase Admin SDK to search for a user with the given email.
 *
 * @param email - The email address to search for
 * @returns Promise resolving to the UserRecord if found, null otherwise
 * @throws {Error} If there's an error querying Firebase Auth
 * @example
 * ```ts
 * const user = await findUserByEmail("user@example.com");
 * if (user) {
 *   console.log("User found:", user.uid);
 * }
 * ```
 */
export const findUserByEmail = async (email: string): Promise<UserRecord | null> => {
  try {
    const adminAuth = firebaseAdmin.auth();
    const user = await adminAuth.getUserByEmail(email);
    return user;
  } catch (e) {
    if (e instanceof FirebaseAppError && e.code === USER_NOT_FOUND) {
      return null;
    }

    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    console.error("Error finding user by email:", errorMessage);
    throw e;
  }
};
