import { redirect } from "next/navigation";

import { ADMIN, DASHBOARD_PATH, DASHBOARD_PERMISSION_CODES_PATH, LOGIN_PATH } from "@/constants";
import { getAuthenticatedUser } from "@/lib";

import { PermissionCodesTable } from "./_components";
import { getPermissionCodes } from "./_lib/permission-codes.lib";

const PermissionCodesPage = async () => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PERMISSION_CODES_PATH)}`;

  const { role } = await getAuthenticatedUser(redirectPath);
  if (role !== ADMIN) redirect(DASHBOARD_PATH);

  const permissionCodes = await getPermissionCodes();

  return <PermissionCodesTable permissionCodes={permissionCodes} />;
};

export default PermissionCodesPage;
