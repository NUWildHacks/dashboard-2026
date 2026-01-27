import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

import { DASHBOARD_PATH, LOGIN_PATH, REGISTRATION_PATH } from "@/constants";
import { getUserDocSnapshot, verifySession } from "@/lib";
import type { User } from "@/types";

import { DashboardSidebar } from "./_components";

type DashboardLayoutProps = PropsWithChildren;

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  const { role } = userDocSnapshot.data() as Omit<User, "id">;

  return <DashboardSidebar role={role}>{children}</DashboardSidebar>;
};

export default DashboardLayout;
