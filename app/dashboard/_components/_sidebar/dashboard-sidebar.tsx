"use client";

import { ChevronRight, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ComponentProps, PropsWithChildren } from "react";

import { SidebarLogoutButton } from "@/app/dashboard/_components";
import Discord from "@/components/icon/discord";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DISCORD_INVITE_PATH, DASHBOARD_SETTINGS_PATH } from "@/constants";
import { Role } from "@/types";

import { useDashboardSidebar } from "../../_hooks";
import { SIDEBAR_ITEMS } from "../../constants";

type DashboardSidebarProps = PropsWithChildren<{
  role: Role;
}> &
  ComponentProps<typeof Sidebar>;

const DashboardSidebar = ({ role, children, ...props }: DashboardSidebarProps) => {
  const { openSubMenus, handleOpenSubMenu, isPathActive, headerText } = useDashboardSidebar();

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
                if (item.hasSubItems) {
                  const hasActiveSubItem = item.subItems.some((subItem) => isPathActive(subItem.url));
                  const isSubMenuOpen = openSubMenus[item.title] ?? hasActiveSubItem;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton className="font-regular" onClick={() => handleOpenSubMenu(item.title)}>
                        <item.icon />
                        <span>{item.title}</span>
                        <ChevronRight
                          className={`ml-auto transition-transform duration-200 ${isSubMenuOpen ? "rotate-90" : ""}`}
                        />
                      </SidebarMenuButton>
                      {isSubMenuOpen && (
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link href={subItem.url} className="font-regular">
                                  {subItem.title}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  );
                }
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
                <a href={DISCORD_INVITE_PATH} target="_blank" rel="noopener noreferrer">
                  <Discord />
                  Join our Discord
                </a>
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
      <SidebarInset className="flex-1 min-w-0">
        <div className="h-full flex flex-col rounded-lg min-w-0">
          <div className="flex h-12 shrink-0 items-center gap-2 px-4 border-b border-border">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <p className="flex-1">{headerText}</p>
          </div>
          <main className="flex-1 flex flex-col gap-4 p-4">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardSidebar;
