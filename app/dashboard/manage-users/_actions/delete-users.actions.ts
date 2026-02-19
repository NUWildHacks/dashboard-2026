"use server";

import { getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

import admin from "@/config/firebase-admin";
import { DASHBOARD_MANAGE_USERS_PATH, ADMIN, LOGIN_PATH, USERS_COLLECTION } from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { ActionResult, User } from "@/types";

export type DeleteUsersResult = ActionResult;

export const deleteUsers = async (userIds: User["id"][]): Promise<DeleteUsersResult> => {
  const db = getFirestore();

  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_MANAGE_USERS_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);

    const roleError = requireRole(user, ADMIN, "You are not authorized to delete users");
    if (roleError) return roleError;

    const batch = db.batch();

    for (const userId of userIds) {
      if (userId === user.id) {
        return { success: false, error: "You cannot delete yourself. Please withdraw from the event instead." };
      }

      const userDocRef = db.collection(USERS_COLLECTION).doc(userId);
      batch.delete(userDocRef);
    }

    await batch.commit();

    await admin.auth().deleteUsers(userIds);

    revalidatePath(DASHBOARD_MANAGE_USERS_PATH);

    return { success: true };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Delete users error:", detailedError);

    const isProduction = process.env.APP_ENV === "production";
    const errorMessage = isProduction ? "An unknown error occurred. Please try again." : detailedError;

    return { success: false, error: errorMessage };
  }
};
