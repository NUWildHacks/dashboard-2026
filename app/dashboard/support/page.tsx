import { redirect } from "next/navigation";

import { DASHBOARD_SUPPORT_PATH, LOGIN_PATH, REGISTRATION_PATH } from "@/constants";
import { getUserDocSnapshot, verifySession } from "@/lib";

const SupportPage = async () => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_SUPPORT_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  return <></>;
};

export default SupportPage;
