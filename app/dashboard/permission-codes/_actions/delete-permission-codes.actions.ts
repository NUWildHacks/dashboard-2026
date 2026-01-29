"use server";

import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import { PermissionCode } from "@/app/dashboard/permission-codes/_types";
import { LOGIN_PATH, ADMIN, PERMISSION_CODES_COLLECTION, DASHBOARD_PERMISSION_CODES_PATH } from "@/constants";
import { getUserDocSnapshot, verifySession } from "@/lib";
import type { ActionResult, User } from "@/types";

export type DeletePermissionCodesResult = ActionResult;

export const deletePermissionCodes = async (
  permissionCodeIds: PermissionCode["id"][]
): Promise<DeletePermissionCodesResult> => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PERMISSION_CODES_PATH)}`);

  const db = getFirestore();

  try {
    const userDocSnapshot = await getUserDocSnapshot(userId);
    if (!userDocSnapshot.exists) {
      return {
        success: false,
        error: "User document not found",
      };
    }

    const { role } = userDocSnapshot.data() as Omit<User, "id">;
    if (role !== ADMIN) {
      return {
        success: false,
        error: "You are not authorized to delete permission codes",
      };
    }

    if (permissionCodeIds.length === 0) {
      return {
        success: false,
        error: "No permission codes provided",
      };
    }

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
