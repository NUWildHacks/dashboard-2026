"use server";

import { FirebaseFirestoreError, getFirestore } from "firebase-admin/firestore";

import { ADMIN, ANNOUNCEMENTS_COLLECTION, DASHBOARD_ANNOUNCEMENTS_PATH, LOGIN_PATH } from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { ActionResult } from "@/types";

import { Announcement } from "../types";

export type DeleteAnnouncementResult = ActionResult;

export const deleteAnnouncement = async (announcementId: Announcement["id"]): Promise<DeleteAnnouncementResult> => {
  const db = getFirestore();

  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_ANNOUNCEMENTS_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);

    const roleError = requireRole(user, ADMIN, "You are not authorized to delete announcements");
    if (roleError) return roleError;

    await db.collection(ANNOUNCEMENTS_COLLECTION).doc(announcementId).delete();

    return { success: true };
  } catch (error) {
    let errorMessage;
    if (error instanceof FirebaseFirestoreError || error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "An unknown error occurred";
    }

    console.error("Delete announcement error:", errorMessage);

    return { success: false, error: errorMessage };
  }
};
