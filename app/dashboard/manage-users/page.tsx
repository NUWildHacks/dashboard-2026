import { redirect } from "next/navigation";

import { ADMIN, DASHBOARD_PATH, DASHBOARD_MANAGE_USERS_PATH, LOGIN_PATH, JUDGE } from "@/constants";
import { getAuthenticatedUser } from "@/lib";

import { getProjectsWithMetadata } from "../(judging)/lib";

import { JudgingAssignmentsTable, PermissionCodesTable, UsersTable } from "./_components";
import { getJudgingAssignments, getPermissionCodes, getUsers } from "./_lib";

const ManageUsersPage = async () => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_MANAGE_USERS_PATH)}`;

  const { role } = await getAuthenticatedUser(redirectPath);
  if (role !== ADMIN) redirect(DASHBOARD_PATH);

  const [permissionCodes, users, projectsWithMetadata, judgingAssignments] = await Promise.all([
    getPermissionCodes(),
    getUsers(),
    getProjectsWithMetadata(),
    getJudgingAssignments(),
  ]);

  const judges = users.filter((user) => user.role === JUDGE);

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
      <div className="flex flex-col gap-4">
        <h2 className="text-md font-semibold">Judging Assignments</h2>
        <JudgingAssignmentsTable
          projectsWithMetadata={projectsWithMetadata}
          judgingAssignments={judgingAssignments}
          judges={judges}
        />
      </div>
    </div>
  );
};

export default ManageUsersPage;
