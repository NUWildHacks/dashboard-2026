import { redirect } from "next/navigation";

import { ADMIN, LOGIN_PATH, REGISTRATION_PATH, DASHBOARD_PERMISSION_CODES_PATH, DASHBOARD_PATH } from "@/constants";
import { getUserDocSnapshot, verifySession } from "@/lib";
import type { User } from "@/types";

import { PermissionCodesTable } from "./_components";
import { getPermissionCodes } from "./_lib/permission-codes.lib";

const PermissionCodesPage = async () => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PERMISSION_CODES_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  const { role } = userDocSnapshot.data() as Omit<User, "id">;
  if (role !== ADMIN) redirect(DASHBOARD_PATH);

  const permissionCodes = await getPermissionCodes();

  return <PermissionCodesTable permissionCodes={permissionCodes} />;
};

export default PermissionCodesPage;
