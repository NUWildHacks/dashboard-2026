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

import FooterLogoutButton from "./footer-logout-button";

const primaryItems = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Schedule",
    url: "/dashboard/schedule",
    icon: Calendar,
  },
  {
    title: "Project",
    url: "/dashboard/project",
    icon: CodeXml,
  },
  {
    title: "Team",
    url: "/dashboard/team",
    icon: Users,
  },
  {
    title: "Judging",
    url: "/dashboard/judging",
    icon: TestTubeDiagonal,
  },
];

const secondaryItems = [
  {
    title: "Support",
    url: "/dashboard/support",
    icon: CircleQuestionMark,
  },
  {
    title: "Feedback",
    url: "/dashboard/feedback",
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
              <Link href={"#"} className="font-regular">
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
