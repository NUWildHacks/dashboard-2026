import { Home, CircleQuestionMark, TestTubeDiagonal, Calendar, CodeXml, Users, Send, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ComponentProps } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DASHBOARD_FEEDBACK_PATH,
  DASHBOARD_JUDGING_PATH,
  DASHBOARD_PATH,
  DASHBOARD_PROJECT_PATH,
  DASHBOARD_SCHEDULE_PATH,
  DASHBOARD_SETTINGS_PATH,
  DASHBOARD_SUPPORT_PATH,
  DASHBOARD_TEAM_PATH,
} from "@/constants/routes";

import FooterLogoutButton from "./footer-logout-button";

const primaryItems = [
  {
    title: "Home",
    url: DASHBOARD_PATH,
    icon: Home,
  },
  {
    title: "Schedule",
    url: DASHBOARD_SCHEDULE_PATH,
    icon: Calendar,
  },
  {
    title: "Project",
    url: DASHBOARD_PROJECT_PATH,
    icon: CodeXml,
  },
  {
    title: "Team",
    url: DASHBOARD_TEAM_PATH,
    icon: Users,
  },
  {
    title: "Judging",
    url: DASHBOARD_JUDGING_PATH,
    icon: TestTubeDiagonal,
  },
];

const secondaryItems = [
  {
    title: "Support",
    url: DASHBOARD_SUPPORT_PATH,
    icon: CircleQuestionMark,
  },
  {
    title: "Feedback",
    url: DASHBOARD_FEEDBACK_PATH,
    icon: Send,
  },
];

export function DashboardSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="font-semibold text-lg text-nowrap px-2 flex items-center gap-3">
              <Image src="/wildhacks.svg" alt="Navigation Logo" width={48} height={30} />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="flex flex-col gap-4">
          <SidebarMenu className="gap-2">
            {primaryItems.map((primaryItem) => (
              <SidebarMenuItem key={primaryItem.title}>
                <SidebarMenuButton asChild>
                  <Link href={primaryItem.url} className="font-regular">
                    <primaryItem.icon />
                    {primaryItem.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Help</SidebarGroupLabel>
          <SidebarMenu className="gap-2">
            {secondaryItems.map((secondaryItem) => (
              <SidebarMenuItem key={secondaryItem.title}>
                <SidebarMenuButton asChild>
                  <Link href={secondaryItem.url} className="font-regular">
                    <secondaryItem.icon />
                    {secondaryItem.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={DASHBOARD_SETTINGS_PATH} className="font-regular">
                <Settings />
                Settings
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <FooterLogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
