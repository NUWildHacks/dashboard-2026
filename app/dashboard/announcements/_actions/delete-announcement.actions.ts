"use server";

import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import { ANNOUNCEMENTS_COLLECTION, LOGIN_PATH, DASHBOARD_ANNOUNCEMENTS_PATH, ADMIN } from "@/constants";
import { getUserDocSnapshot, verifySession } from "@/lib";
import type { ActionResult, User } from "@/types";

export type DeleteAnnouncementResult = ActionResult;

export const deleteAnnouncement = async (announcementId: string): Promise<DeleteAnnouncementResult> => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_ANNOUNCEMENTS_PATH)}`);

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
        error: "You are not authorized to delete announcements",
      };
    }

    const announcementDocRef = db.collection(ANNOUNCEMENTS_COLLECTION).doc(announcementId);
    const announcementDocSnapshot = await announcementDocRef.get();
    if (!announcementDocSnapshot.exists) {
      return {
        success: false,
        error: "Announcement not found",
      };
    }

    await announcementDocRef.delete();

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Delete announcement error:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
};
