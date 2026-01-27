import { redirect } from "next/navigation";

import { ADMIN, LOGIN_PATH, REGISTRATION_PATH, DASHBOARD_MANAGE_USERS_PATH, DASHBOARD_PATH } from "@/constants";
import { getUserDocSnapshot, verifySession } from "@/lib";
import type { User } from "@/types";

const ManageUsersPage = async () => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_MANAGE_USERS_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  const { role } = userDocSnapshot.data() as Omit<User, "id">;
  if (role !== ADMIN) redirect(DASHBOARD_PATH);

  return <div className="flex-1 flex flex-col items-center gap-4">Manage users</div>;
};

export default ManageUsersPage;
