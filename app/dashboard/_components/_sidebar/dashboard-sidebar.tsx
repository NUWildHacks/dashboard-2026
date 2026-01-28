"use client";

import { CircleQuestionMark, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, PropsWithChildren } from "react";

import { SidebarLogoutButton } from "@/app/dashboard/_components";
import { getHeaderText } from "@/app/dashboard/_lib";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DASHBOARD_SUPPORT_PATH, DASHBOARD_SETTINGS_PATH } from "@/constants";
import { Role } from "@/types";

import { SIDEBAR_ITEMS } from "../../_constants";

type DashboardSidebarProps = PropsWithChildren<{
  role: Role;
}> &
  ComponentProps<typeof Sidebar>;

const DashboardSidebar = ({ role, children, ...props }: DashboardSidebarProps) => {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar variant="inset" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" className="font-semibold text-lg text-nowrap px-2 flex items-center gap-3">
                <Image src="/wildhacks.svg" alt="Dashboard Logo" width={30} height={39} />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="flex flex-col gap-4">
            <SidebarMenu className="gap-2">
              {SIDEBAR_ITEMS.map((item) => {
                if (!item.visibleTo.includes(role)) return null;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className="font-regular">
                        <item.icon />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu className="gap-2">
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={DASHBOARD_SUPPORT_PATH} className="font-regular">
                  <CircleQuestionMark />
                  Support
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={DASHBOARD_SETTINGS_PATH} className="font-regular">
                  <Settings />
                  Settings
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarLogoutButton />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex-1">
        <div className="h-full flex flex-col rounded-lg">
          <div className="flex h-12 shrink-0 items-center gap-2 px-4 border-b border-border">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <p className="flex-1">{getHeaderText(pathname)}</p>
          </div>
          <main className="flex-1 flex flex-col gap-4 p-4">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardSidebar;
