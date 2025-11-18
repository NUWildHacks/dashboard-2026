import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DASHBOARD_PATH, LOGIN_PATH, REGISTRATION_PATH } from "@/constants/routes";

import { verifySession } from "../../lib/session";
import getUserDocSnapshot from "../../lib/user";

import { DashboardSidebar } from "./_components/dashboard-sidebar";

type DashboardLayoutProps = PropsWithChildren;

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <div className="flex-1 ">
        <div className="h-full rounded-lg">
          <div className="flex h-12 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <p>Page Name</p>
          </div>
          <main className="flex flex-col gap-4 p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
