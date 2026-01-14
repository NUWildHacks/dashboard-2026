import { redirect } from "next/navigation";

import "@/config/firebase-admin";
import { DASHBOARD_SCHEDULE_PATH, LOGIN_PATH, REGISTRATION_PATH } from "@/constants/routes.constants";
import { verifySession } from "@/lib/session.lib";
import { getUserDocSnapshot } from "@/lib/user.lib";
import { getConfigDocSnapshot } from "@/lib/wildhacks.lib";
import { WildHacksConfig } from "@/types/wildhacks.types";

import { Calendar } from "./_components";

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
