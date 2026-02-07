"use server";

import { getFirestore } from "firebase-admin/firestore";

import {
  ADMIN,
  DASHBOARD_MANAGE_USERS_PATH,
  LOGIN_PATH,
  ONE_DAY,
  PERMISSION_CODES_COLLECTION,
  USERS_COLLECTION,
} from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { ActionResult } from "@/types";

import { type CreatePermissionCodeDialogSchema } from "../_schemas/create-permission-code-dialog.schemas";

export type CreatePermissionCodeResult = ActionResult<CreatePermissionCodeDialogSchema>;

export const createPermissionCode = async (
  data: CreatePermissionCodeDialogSchema
): Promise<CreatePermissionCodeResult> => {
  const db = getFirestore();
  const now = Date.now();

  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_MANAGE_USERS_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);

    const roleError = requireRole(user, ADMIN, "You are not authorized to create permission codes");
    if (roleError) return roleError;

    const { email } = data;

    const existingUserDocSnapshots = await db.collection(USERS_COLLECTION).where("email", "==", email).get();
    if (!existingUserDocSnapshots.empty) {
      return {
        success: false,
        error: "User already registered",
      };
    }

    await db
      .collection(PERMISSION_CODES_COLLECTION)
      .doc()
      .set({
        email,
        created_at: now,
        expires_at: now + ONE_DAY,
      });

    return { success: true };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Create permission code error:", detailedError);

    const isProduction = process.env.APP_ENV === "production";
    const errorMessage = isProduction ? "An unknown error occurred. Please try again." : detailedError;

    return { success: false, error: errorMessage };
  }
};
