import type { LucideIcon } from "lucide-react";

import { Role } from "@/types";

export type SidebarSubItem = {
  title: string;
  url: string;
};

type SidebarItemBase = {
  title: string;
  icon: LucideIcon;
  visibleTo: Role[];
};

export type SidebarItem =
  | (SidebarItemBase & {
      hasSubItems: true;
      subItems: SidebarSubItem[];
    })
  | (SidebarItemBase & {
      hasSubItems: false;
      url: string;
    });
