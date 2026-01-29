import { getFirestore } from "firebase-admin/firestore";

import { PERMISSION_CODES_COLLECTION } from "@/constants";

import type { PermissionCode } from "./types";

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
export const getPermissionCodes = async (): Promise<PermissionCode[]> => {
  const db = getFirestore();

  const permissionCodeDocRef = db.collection(PERMISSION_CODES_COLLECTION);

  const permissionCodeDocSnapshots = await permissionCodeDocRef.get();

  if (!permissionCodeDocSnapshots.docs.length) {
    return [];
  }

  return permissionCodeDocSnapshots.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as PermissionCode
  );
};
