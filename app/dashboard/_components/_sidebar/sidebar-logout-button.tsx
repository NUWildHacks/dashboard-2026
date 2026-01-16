import { LogOut } from "lucide-react";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { deleteSession } from "@/lib";

const SidebarLogoutButton = () => {
  return (
    <SidebarMenuButton onClick={deleteSession} className="text-nowrap">
      <LogOut />
      Log out
    </SidebarMenuButton>
  );
};

export default SidebarLogoutButton;
