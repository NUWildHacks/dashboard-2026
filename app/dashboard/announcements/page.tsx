import { redirect } from "next/navigation";

import { DASHBOARD_ANNOUNCEMENTS_PATH, LOGIN_PATH } from "@/constants/routes";
import { verifySession } from "@/lib/session";
import getUserDocSnapshot from "@/lib/user";

import AnnouncementList from "./_components/announcements-list";

export default async function Announcements() {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_ANNOUNCEMENTS_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(DASHBOARD_ANNOUNCEMENTS_PATH);

  return <AnnouncementList announcements={[]} />;
}
