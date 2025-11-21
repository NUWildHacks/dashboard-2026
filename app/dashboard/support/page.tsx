import { redirect } from "next/navigation";

import { DASHBOARD_SUPPORT_PATH, LOGIN_PATH } from "@/constants/routes";
import { verifySession } from "@/lib/session";
import getUserDocSnapshot from "@/lib/user";

export default async function Support() {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_SUPPORT_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(DASHBOARD_SUPPORT_PATH);

  return <></>;
}
