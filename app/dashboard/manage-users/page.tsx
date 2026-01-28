import { redirect } from "next/navigation";

import { DataTable } from "@/components/ui/data-table";
import { ADMIN, LOGIN_PATH, REGISTRATION_PATH, DASHBOARD_MANAGE_USERS_PATH, DASHBOARD_PATH } from "@/constants";
import { getUserDocSnapshot, verifySession } from "@/lib";
import type { User } from "@/types";

import { permissionCodesColumns } from "./_components";
import { MOCK_PERMISSION_CODES } from "./_constants/permission-codes.constants";

const ManageUsersPage = async () => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_MANAGE_USERS_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  const { role } = userDocSnapshot.data() as Omit<User, "id">;
  if (role !== ADMIN) redirect(DASHBOARD_PATH);

  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-md font-semibold">Permission Codes</h2>
        <DataTable columns={permissionCodesColumns} data={MOCK_PERMISSION_CODES} />
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-md font-semibold">Users</h2>
      </div>
    </div>
  );
};

export default ManageUsersPage;
