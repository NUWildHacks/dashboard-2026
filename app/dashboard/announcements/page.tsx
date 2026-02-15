import { AnnouncementsDisplay } from "@/app/dashboard/announcements/_components";
import { DASHBOARD_ANNOUNCEMENTS_PATH, LOGIN_PATH } from "@/constants";
import { getAuthenticatedUser } from "@/lib";

const AnnouncementsPage = async () => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_ANNOUNCEMENTS_PATH)}`;

  const { role } = await getAuthenticatedUser(redirectPath);

  return <AnnouncementsDisplay userRole={role} />;
};

export default AnnouncementsPage;
