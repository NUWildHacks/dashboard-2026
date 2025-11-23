"use client";

import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getHeaderText } from "@/lib/sidebar";

import { DashboardSidebar } from "./_components/dashboard-sidebar";

type DashboardLayoutProps = PropsWithChildren;

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="flex-1">
        <div className="h-full rounded-lg">
          <div className="flex h-12 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <p>{getHeaderText(pathname)}</p>
          </div>
          <main className="flex flex-col gap-4 p-4">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
