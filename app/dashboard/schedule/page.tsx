import { redirect } from "next/navigation";

import { DASHBOARD_SCHEDULE_PATH, LOGIN_PATH, REGISTRATION_PATH } from "@/constants/routes.constants";
import { verifySession } from "@/lib/session.lib";
import { getUserDocSnapshot } from "@/lib/user.lib";

import { Calendar } from "./_components";

const Schedule = async () => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_SCHEDULE_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  return <Calendar />;
};

export default Schedule;
