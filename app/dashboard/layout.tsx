"use client";

import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

import { getHeaderText } from "@/app/dashboard/_lib/sidebar.lib";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import DashboardSidebar from "./_components/_sidebar/dashboard-sidebar";

type DashboardLayoutProps = PropsWithChildren;

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="flex-1">
        <div className="h-full flex flex-col rounded-lg">
          <div className="flex h-12 shrink-0 items-center gap-2 px-4 border-b border-gray-200">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <p>{getHeaderText(pathname)}</p>
          </div>
          <main className="flex-1 flex flex-col gap-4 p-4">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
