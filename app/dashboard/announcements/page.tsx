import { redirect } from "next/navigation";

import { DASHBOARD_ANNOUNCEMENTS_PATH, LOGIN_PATH, REGISTRATION_PATH } from "@/constants/routes";
import { verifySession } from "@/lib/session";
import { getUserDocSnapshot } from "@/lib/user";
import User from "@/types/user";

import AnnouncementsWithFilters from "./_components/announcements-with-filters";

export default async function Announcements() {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_ANNOUNCEMENTS_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  const { role } = userDocSnapshot.data() as User;

  return <AnnouncementsWithFilters userRole={role} />;
}
