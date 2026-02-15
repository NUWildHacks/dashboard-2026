"use server";

import { getFirestore } from "firebase-admin/firestore";

import { ADMIN, ANNOUNCEMENTS_COLLECTION, DASHBOARD_ANNOUNCEMENTS_PATH, LOGIN_PATH } from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { ActionResult } from "@/types";

import { type AnnouncementFormSchema } from "../_schemas/announcement-form.schemas";
import { Announcement } from "../types";

export type SaveAnnouncementResult = ActionResult<AnnouncementFormSchema>;

export const saveAnnouncement = async (
  data: AnnouncementFormSchema,
  announcementId?: Announcement["id"]
): Promise<SaveAnnouncementResult> => {
  const db = getFirestore();
  const now = Date.now();

  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_ANNOUNCEMENTS_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);

    const roleError = requireRole(user, ADMIN, "You are not authorized to save announcements");
    if (roleError) return roleError;

    const { links } = data;

    if (announcementId) {
      await db
        .collection(ANNOUNCEMENTS_COLLECTION)
        .doc(announcementId)
        .update({
          ...data,
          links: links.map((link) => link.url.toString()),
          updated_at: now,
        });
    } else {
      await db
        .collection(ANNOUNCEMENTS_COLLECTION)
        .doc()
        .set({
          ...data,
          links: links.map((link) => link.url.toString()),
          created_at: now,
          updated_at: now,
        });
    }

    return { success: true };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Save announcement error:", detailedError);

    const isProduction = process.env.APP_ENV === "production";
    const errorMessage = isProduction ? "An unknown error occurred. Please try again." : detailedError;

    return { success: false, error: errorMessage };
  }
};
