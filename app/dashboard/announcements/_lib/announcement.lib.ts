import { getFirestore } from "firebase-admin/firestore";

import type { Announcement } from "@/app/dashboard/announcements/_types";
import { ANNOUNCEMENTS_COLLECTION } from "@/constants/db.constants";
import User from "@/types/user.types";

import { ANNOUNCEMENT_FIELDS } from "../_constants/announcement.constants";

export async function getAnnouncementsByRole(userRole: User["role"], limit?: number) {
  const db = getFirestore();

  let announcementDocRefs = db
    .collection(ANNOUNCEMENTS_COLLECTION)
    .where(ANNOUNCEMENT_FIELDS.audience, "array-contains", userRole)
    .orderBy(ANNOUNCEMENT_FIELDS.created_at, "desc");

  if (limit) {
    announcementDocRefs = announcementDocRefs.limit(limit);
  }

  const announcementDocSnapshots = await announcementDocRefs.get();

  return announcementDocSnapshots.docs.map((doc) => doc.data() as Announcement);
}
