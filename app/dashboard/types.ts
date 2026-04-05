import type { LucideIcon } from "lucide-react";

import { BaseModel, Role } from "@/types";

export type SidebarItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  visibleTo: Role[];
};

export type ResumeMetadata = BaseModel & {
  file_id: string;
  file_name: string;
  web_view_link: string;
};
