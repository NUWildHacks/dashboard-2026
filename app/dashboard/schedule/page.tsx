import { DASHBOARD_SCHEDULE_PATH, LOGIN_PATH } from "@/constants";
import { getAuthenticatedUser, getConfigDocSnapshot } from "@/lib";
import type { WildHacksConfig } from "@/types";

import { ScheduleDisplay } from "./_components";

const SchedulePage = async () => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_SCHEDULE_PATH)}`;

  const { role } = await getAuthenticatedUser(redirectPath);

  const configDocSnapshot = await getConfigDocSnapshot();
  const wildhacksConfig = configDocSnapshot.data() as WildHacksConfig;

  return <ScheduleDisplay {...wildhacksConfig} userRole={role} />;
};

export default SchedulePage;
