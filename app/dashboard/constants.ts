import { Calendar, FolderGit2, Home, Users } from "lucide-react";

import {
  ADMIN,
  JUDGE,
  MENTOR,
  PARTICIPANT,
  DASHBOARD_MANAGE_USERS_PATH,
  DASHBOARD_PATH,
  DASHBOARD_PROJECT_PATH,
  DASHBOARD_SCHEDULE_PATH,
} from "@/constants";

import type { SidebarItem } from "./types";

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: "Home",
    url: DASHBOARD_PATH,
    icon: Home,
    visibleTo: [ADMIN, PARTICIPANT, JUDGE, MENTOR],
  },
  {
    title: "Schedule",
    url: DASHBOARD_SCHEDULE_PATH,
    icon: Calendar,
    visibleTo: [ADMIN, PARTICIPANT, JUDGE, MENTOR],
  },
  {
    title: "Project",
    url: DASHBOARD_PROJECT_PATH,
    icon: FolderGit2,
    visibleTo: [PARTICIPANT],
  },
  {
    title: "Manage users",
    url: DASHBOARD_MANAGE_USERS_PATH,
    icon: Users,
    visibleTo: [ADMIN],
  },
];

export const HEADER_TEXT_MAP: Record<string, string> = {
  schedule: "Schedule",
  project: "Project",
  support: "Support",
  settings: "Settings",
  "manage-users": "Manage users",
};
