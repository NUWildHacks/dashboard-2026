import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

import { DASHBOARD_PATH, JUDGE, LOGIN_PATH, MENTOR } from "@/constants";
import { getAuthenticatedUser, onboardUser } from "@/lib";

import { DashboardSidebar, OnboardingDialog } from "./_components";

type DashboardLayoutProps = PropsWithChildren;

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`;

  const { id: userId, role } = await getAuthenticatedUser(redirectPath);
  if (!userId) redirect(redirectPath);

  const onboarded = role === JUDGE || role === MENTOR ? await onboardUser(userId) : true;

  return (
    <>
      <DashboardSidebar role={role}>{children}</DashboardSidebar>
      {role === JUDGE || (role === MENTOR && <OnboardingDialog onboarded={onboarded} />)}
    </>
  );
};

export default DashboardLayout;
