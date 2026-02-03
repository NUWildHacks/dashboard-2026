import { getFirestore } from "firebase-admin/firestore";

import { PERMISSION_CODES_COLLECTION, USERS_COLLECTION } from "@/constants";
import type { User } from "@/types";

import type { PermissionCode } from "../types";

/**
 * Get all permission codes from Firestore.
 * Retrieves all documents from the permission codes collection and returns them as an array.
 * Returns an empty array if no permission codes exist.
 *
 * @returns Promise resolving to an array of PermissionCode objects
 * @example
 * ```ts
 * const permissionCodes = await getPermissionCodes();
 * console.log(`Found ${permissionCodes.length} permission codes`);
 * permissionCodes.forEach(code => {
 *   console.log(code.code, code.role);
 * });
 * ```
 */
const getPermissionCodes = async (): Promise<PermissionCode[]> => {
  const db = getFirestore();

  const permissionCodeDocRef = db.collection(PERMISSION_CODES_COLLECTION);

  const permissionCodeDocSnapshots = await permissionCodeDocRef.get();

  return permissionCodeDocSnapshots.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as PermissionCode
  );
};

/**
 * Get all users from Firestore.
 * Retrieves all documents from the users collection and returns them as an array.
 * Returns an empty array if no users exist.
 *
 * @returns Promise resolving to an array of User objects
 * @example
 * ```ts
 * const users = await getUsers();
 * console.log(`Found ${users.length} users`);
 * users.forEach(user => {
 *   console.log(user.email, user.role);
 * });
 * ```
 */
const getUsers = async (): Promise<User[]> => {
  const db = getFirestore();

  const userDocRef = db.collection(USERS_COLLECTION);

  const userDocSnapshots = await userDocRef.get();

  return userDocSnapshots.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as User
  );
};

export { getPermissionCodes, getUsers };
