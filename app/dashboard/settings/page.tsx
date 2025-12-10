import { redirect } from "next/navigation";

import { DASHBOARD_SETTINGS_PATH, LOGIN_PATH, REGISTRATION_PATH } from "@/constants/routes";
import { verifySession } from "@/lib/session";
import { getUserDocSnapshot } from "@/lib/user";

const Settings = async () => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_SETTINGS_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  return <></>;
};

export default Settings;
