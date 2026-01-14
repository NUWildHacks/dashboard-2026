"use server";

import { getFirestore } from "firebase-admin/firestore";

import { USERS_COLLECTION } from "@/constants/db.constants";
import type { User } from "@/types";

/**
 * Get a user document snapshot from Firestore.
 * Retrieves the user document for the given user ID.
 *
 * @param userId - The user ID to retrieve
 * @returns Promise resolving to the Firestore document snapshot (may not exist)
 * @example
 * ```ts
 * const userId = await verifySession();
 * const userSnapshot = await getUserDocSnapshot(userId);
 * if (userSnapshot.exists) {
 *   const userData = userSnapshot.data() as Omit<User, "id">;
 *   console.log(userData.role, userData.email);
 * }
 * ```
 */
const getUserDocSnapshot = async (userId: User["id"]) => {
  const db = getFirestore();

  const userDocRef = db.collection(USERS_COLLECTION).doc(userId);

  const userDocSnapshot = await userDocRef.get();

  return userDocSnapshot;
};

export { getUserDocSnapshot };
