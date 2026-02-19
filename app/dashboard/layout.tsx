import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

import { DASHBOARD_PATH, LOGIN_PATH } from "@/constants";
import { getAuthenticatedUser } from "@/lib";

import { DashboardSidebar } from "./_components";

type DashboardLayoutProps = PropsWithChildren;

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`;

  const { id: userId, role } = await getAuthenticatedUser(redirectPath);
  if (!userId) redirect(redirectPath);

  return <DashboardSidebar role={role}>{children}</DashboardSidebar>;
};

export default DashboardLayout;
