import { redirect } from "next/navigation";

import { ADMIN, DASHBOARD_PATH, DASHBOARD_MANAGE_USERS_PATH, LOGIN_PATH } from "@/constants";
import { getAuthenticatedUser } from "@/lib";

import { PermissionCodesTable, UsersTable } from "./_components";
import { getPermissionCodes, getUsers } from "./_lib/lib";

const PermissionCodesPage = async () => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_MANAGE_USERS_PATH)}`;

  const { role } = await getAuthenticatedUser(redirectPath);
  if (role !== ADMIN) redirect(DASHBOARD_PATH);

  const permissionCodes = await getPermissionCodes();
  const users = await getUsers();

  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-md font-semibold">Permission Codes</h2>
        <PermissionCodesTable permissionCodes={permissionCodes} />
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-md font-semibold">Users</h2>
        <UsersTable users={users} />
      </div>
    </div>
  );
};

export default PermissionCodesPage;
