import { redirect } from "next/navigation";

import "@/config/firebase-admin";
import { Calendar } from "@/app/dashboard/schedule/_components";
import { DASHBOARD_SCHEDULE_PATH, LOGIN_PATH, REGISTRATION_PATH } from "@/constants";
import { getConfigDocSnapshot, getUserDocSnapshot, verifySession } from "@/lib";
import type { WildHacksConfig } from "@/types";

const SchedulePage = async () => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_SCHEDULE_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  const configDocSnapshot = await getConfigDocSnapshot();
  const wildhacksConfig = configDocSnapshot.data() as WildHacksConfig;

  return <Calendar config={wildhacksConfig} />;
};

export default SchedulePage;
