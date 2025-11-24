import { getFirestore } from "firebase-admin/firestore";

import { ANNOUNCEMENTS_COLLECTION } from "@/constants/db";
import { Announcement } from "@/types/announcement";
import User from "@/types/user";

export async function getAnnouncementsByRole(userRole: User["role"], limit?: number) {
  const db = getFirestore();

  let announcementDocRefs = db
    .collection(ANNOUNCEMENTS_COLLECTION)
    .where("audience", "array-contains", userRole)
    .orderBy("created_at", "desc");

  if (limit) {
    announcementDocRefs = announcementDocRefs.limit(limit);
  }

  const announcementDocSnapshots = await announcementDocRefs.get();

  return announcementDocSnapshots.docs.map((doc) => doc.data() as Announcement);
}
