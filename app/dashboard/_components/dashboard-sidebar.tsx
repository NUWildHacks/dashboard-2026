import { Home, CircleQuestionMark, TestTubeDiagonal, Calendar, CodeXml, Users, Send } from "lucide-react"
import Link from "next/link"
import { ComponentProps } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { FooterUser } from "./footer-user"

const topItems = [
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
]

const bottomItems = [
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
]

export function DashboardSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating" className="h-full" {...props}>
      <SidebarContent>
        <SidebarGroup className="flex flex-col gap-4">
          <SidebarMenu className="gap-2">
            {topItems.map((topItem) => (
              <SidebarMenuItem key={topItem.title}>
                <SidebarMenuButton asChild>
                  <Link href={topItem.url} className="font-regular">
                    <topItem.icon />
                    {topItem.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
        <SidebarMenu className="gap-2">
            {bottomItems.map((bottomItem) => (
              <SidebarMenuItem key={bottomItem.title}>
                <SidebarMenuButton asChild>
                  <Link href={bottomItem.url} className="font-regular">
                    <bottomItem.icon />
                    {bottomItem.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <FooterUser />
      </SidebarFooter>
    </Sidebar>
  )
}
