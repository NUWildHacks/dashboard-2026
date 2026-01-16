import { redirect } from "next/navigation";

import { AnnouncementsWithFilters } from "@/app/dashboard/announcements/_components";
import { DASHBOARD_ANNOUNCEMENTS_PATH, LOGIN_PATH, REGISTRATION_PATH } from "@/constants";
import { getUserDocSnapshot, verifySession } from "@/lib";
import type { User } from "@/types";

const AnnouncementsPage = async () => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_ANNOUNCEMENTS_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  const { role } = userDocSnapshot.data() as Omit<User, "id">;

  return <AnnouncementsWithFilters userRole={role} />;
};

export default AnnouncementsPage;
