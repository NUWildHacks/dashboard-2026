import { redirect } from "next/navigation";

import { ADMIN, DASHBOARD_PATH, DASHBOARD_MANAGE_USERS_PATH, LOGIN_PATH, JUDGE, JUDGE_AND_MENTOR } from "@/constants";
import { getAuthenticatedUser } from "@/lib";

import { JudgingAssignmentsTable, UsersTable } from "./_components";
import { getJudgingAssignments, getProjects, getUsers } from "./_lib";

const ManageUsersPage = async () => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_MANAGE_USERS_PATH)}`;

  const { role, id } = await getAuthenticatedUser(redirectPath);
  if (role !== ADMIN) redirect(DASHBOARD_PATH);

  const [users, judgingAssignments, projects] = await Promise.all([getUsers(), getJudgingAssignments(), getProjects()]);

  const judges = users.filter((user) => user.role === JUDGE || user.role === JUDGE_AND_MENTOR);

  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-md font-semibold">Users</h2>
        <UsersTable userId={id} users={users} />
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-md font-semibold">Judging Assignments</h2>
        <JudgingAssignmentsTable judgingAssignments={judgingAssignments} projects={projects} judges={judges} />
      </div>
    </div>
  );
};

export default ManageUsersPage;
