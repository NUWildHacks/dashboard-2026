import { redirect } from "next/navigation";

import { ADMIN, DASHBOARD_PATH, DASHBOARD_MANAGE_USERS_PATH, LOGIN_PATH, JUDGE } from "@/constants";
import { getAuthenticatedUser } from "@/lib";

import { UsersTable } from "./_components";
import { getUsers } from "./_lib";

const ManageUsersPage = async () => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_MANAGE_USERS_PATH)}`;

  const { role } = await getAuthenticatedUser(redirectPath);
  if (role !== ADMIN) redirect(DASHBOARD_PATH);

  const [users] = await Promise.all([getUsers()]);

  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-md font-semibold">Users</h2>
        <UsersTable users={users} />
      </div>
    </div>
  );
};

export default ManageUsersPage;
