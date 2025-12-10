import { redirect } from "next/navigation";

import { DASHBOARD_SCHEDULE_PATH, LOGIN_PATH, REGISTRATION_PATH } from "@/constants/routes";
import { verifySession } from "@/lib/session";
import { getUserDocSnapshot } from "@/lib/user";

import Calendar from "./_components/calendar";

export default async function Schedule() {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_SCHEDULE_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  return <Calendar />;
}
