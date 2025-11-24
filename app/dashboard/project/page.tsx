import { redirect } from "next/navigation";

import { DASHBOARD_PROJECT_PATH, LOGIN_PATH, REGISTRATION_PATH } from "@/constants/routes";
import { verifySession } from "@/lib/session";
import { getUserDocSnapshot } from "@/lib/user";

export default async function Project() {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PROJECT_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  return <></>;
}
