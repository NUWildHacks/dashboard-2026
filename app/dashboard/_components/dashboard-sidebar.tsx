import {
  Home,
  CircleQuestionMark,
  TestTubeDiagonal,
  Calendar,
  CodeXml,
  Users,
  Send,
  BadgeCheck,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { ComponentProps } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import FooterLogoutButton from "./footer-logout-button";

const primaryItems = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Schedule",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Project",
    url: "#",
    icon: CodeXml,
  },
  {
    title: "Team",
    url: "#",
    icon: Users,
  },
  {
    title: "Judging",
    url: "#",
    icon: TestTubeDiagonal,
  },
];

const secondaryItems = [
  {
    title: "Support",
    url: "#",
    icon: CircleQuestionMark,
  },
  {
    title: "Feedback",
    url: "#",
    icon: Send,
  },
];

export function DashboardSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton className="font-semibold text-lg text-nowrap">
              <LayoutDashboard />
              WildHacks 2026
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
                <BadgeCheck />
                Profile
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
