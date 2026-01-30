"use server";

import { FirebaseFirestoreError, getFirestore } from "firebase-admin/firestore";

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
      const userDocRef = db.collection(USERS_COLLECTION).doc(userId);
      batch.delete(userDocRef);
    }

    await batch.commit();

    return { success: true };
  } catch (error) {
    let errorMessage;
    if (error instanceof FirebaseFirestoreError || error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "An unknown error occurred";
    }

    console.error("Delete users error:", errorMessage);

    return { success: false, error: errorMessage };
  }
};
