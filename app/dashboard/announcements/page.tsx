import { redirect } from "next/navigation";

import { DASHBOARD_ANNOUNCEMENTS_PATH, LOGIN_PATH, REGISTRATION_PATH } from "@/constants/routes.constants";
import { verifySession } from "@/lib/session.lib";
import { getUserDocSnapshot } from "@/lib/user.lib";
import User from "@/types/user.types";

import { AnnouncementsWithFilters } from "./_components";

const AnnouncementsPage = async () => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_ANNOUNCEMENTS_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  const { role } = userDocSnapshot.data() as Omit<User, "id">;

  return <AnnouncementsWithFilters userRole={role} />;
};

export default AnnouncementsPage;
