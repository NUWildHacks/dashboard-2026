import { PropsWithChildren } from "react"

import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import { DashboardSidebar } from "./_components/dashboard-sidebar"

type DashboardLayoutProps = PropsWithChildren

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex-1 w-full border rounded-2xl bg-background/50 backdrop-blur-md overflow-hidden">
      <SidebarProvider className="min-h-auto ">
        <DashboardSidebar />
        <SidebarInset className="bg-transparent">
          <div className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
          <div className="flex-1 px-4">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
