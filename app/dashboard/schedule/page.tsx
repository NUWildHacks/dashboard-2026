import { DASHBOARD_SCHEDULE_PATH, LOGIN_PATH } from "@/constants";
import { getAuthenticatedUser } from "@/lib";

import { ScheduleDisplay } from "./_components";

const SchedulePage = async () => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_SCHEDULE_PATH)}`;

  const { role } = await getAuthenticatedUser(redirectPath);

  return <ScheduleDisplay userRole={role} />;
};

export default SchedulePage;
