import type { LucideIcon } from "lucide-react";

import { BaseModel, Role } from "@/types";

export type SidebarItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  visibleTo: Role[];
};

export type ResumeMetadata = BaseModel & {
  file_name: string;
  storage_path: string;
  content_type: string;
};
