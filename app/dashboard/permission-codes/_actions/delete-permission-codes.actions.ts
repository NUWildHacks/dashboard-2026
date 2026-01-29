"use server";

import { getFirestore } from "firebase-admin/firestore";

import { PermissionCode } from "@/app/dashboard/permission-codes/_types";
import { PERMISSION_CODES_COLLECTION, DASHBOARD_PERMISSION_CODES_PATH, ADMIN, LOGIN_PATH } from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { ActionResult } from "@/types";

export type DeletePermissionCodesResult = ActionResult;

export const deletePermissionCodes = async (
  permissionCodeIds: PermissionCode["id"][]
): Promise<DeletePermissionCodesResult> => {
  const db = getFirestore();

  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PERMISSION_CODES_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);

    const roleError = requireRole(user, ADMIN, "You are not authorized to delete permission codes");
    if (roleError) return roleError;

    const batch = db.batch();

    for (const permissionCodeId of permissionCodeIds) {
      const permissionCodeDocRef = db.collection(PERMISSION_CODES_COLLECTION).doc(permissionCodeId);
      batch.delete(permissionCodeDocRef);
    }

    await batch.commit();

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Delete permission codes error:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
};
