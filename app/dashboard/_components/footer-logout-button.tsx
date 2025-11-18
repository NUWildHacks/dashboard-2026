import { LogOut } from "lucide-react";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { deleteSession } from "@/lib/session";

export default function FooterLogoutButton() {
  return (
    <SidebarMenuButton onClick={deleteSession} className="text-nowrap">
      <LogOut />
      Log out
    </SidebarMenuButton>
  );
}
