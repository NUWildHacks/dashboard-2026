import type { LucideIcon } from "lucide-react";

import { Role } from "@/types";

export type SidebarItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  visibleTo: Role[];
};
