"use server";

import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import { ANNOUNCEMENTS_COLLECTION, LOGIN_PATH, DASHBOARD_ANNOUNCEMENTS_PATH, ADMIN } from "@/constants";
import { getUserDocSnapshot, verifySession } from "@/lib";
import type { ActionResult, User } from "@/types";

import { type CreateAnnouncementDialogSchema } from "../_schemas/create-announcement-dialog.schemas";

export type CreateAnnouncementResult = ActionResult<CreateAnnouncementDialogSchema>;

export const createAnnouncement = async (
  data: CreateAnnouncementDialogSchema,
): Promise<CreateAnnouncementResult> => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_ANNOUNCEMENTS_PATH)}`);

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
        error: "You are not authorized to create announcements",
      };
    }

    const announcementDocRef = db.collection(ANNOUNCEMENTS_COLLECTION).doc();

    const { links, ...rest } = data;
    await announcementDocRef.set({
      ...rest,
      links: links.map((link) => link.url.toString()),
      created_at: now,
      updated_at: now,
    });

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Create announcement error:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
};
