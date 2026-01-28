"use server";

import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import {
  DASHBOARD_MANAGE_USERS_PATH,
  LOGIN_PATH,
  ONE_HOUR,
  PERMISSION_CODES_COLLECTION,
  ADMIN,
  USERS_COLLECTION,
} from "@/constants";
import { getUserDocSnapshot, verifySession } from "@/lib";
import type { ActionResult, User } from "@/types";

import { type CreatePermissionCodeDialogSchema } from "../_schemas/create-permission-code-dialog.schemas";

export type CreatePermissionCodeResult = ActionResult<CreatePermissionCodeDialogSchema>;

export const createPermissionCode = async (
  data: CreatePermissionCodeDialogSchema
): Promise<CreatePermissionCodeResult> => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_MANAGE_USERS_PATH)}`);

  const db = getFirestore();
  const now = Date.now();

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
        error: "You are not authorized to create permission codes",
      };
    }

    const { email, type } = data;

    const existingUserDocSnapshot = await db.collection(USERS_COLLECTION).where("email", "==", email).get();
    if (!existingUserDocSnapshot.empty) {
      return {
        success: false,
        error: "User already registered",
      };
    }

    const permissionCodeDocRef = db.collection(PERMISSION_CODES_COLLECTION).doc();
    await permissionCodeDocRef.set({
      email,
      type,
      created_at: now,
      expires_at: now + ONE_HOUR,
    });

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Create permission code error:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
};
