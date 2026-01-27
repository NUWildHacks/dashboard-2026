import { Calendar, FolderGit2, Home, Megaphone, Users } from "lucide-react";

import {
  DASHBOARD_ANNOUNCEMENTS_PATH,
  DASHBOARD_MANAGE_USERS_PATH,
  DASHBOARD_PATH,
  DASHBOARD_PROJECT_PATH,
  DASHBOARD_SCHEDULE_PATH,
} from "@/constants/routes.constants";
import { ADMIN, PARTICIPANT } from "@/constants/user.constants";

import type { SidebarItem } from "../_components/_types/sidebar.types";

export const items: SidebarItem[] = [
  {
    title: "Home",
    url: DASHBOARD_PATH,
    icon: Home,
    visibleTo: [ADMIN, PARTICIPANT],
  },
  {
    title: "Announcements",
    url: DASHBOARD_ANNOUNCEMENTS_PATH,
    icon: Megaphone,
    visibleTo: [ADMIN, PARTICIPANT],
  },
  {
    title: "Schedule",
    url: DASHBOARD_SCHEDULE_PATH,
    icon: Calendar,
    visibleTo: [ADMIN, PARTICIPANT],
  },
  {
    title: "Project",
    url: DASHBOARD_PROJECT_PATH,
    icon: FolderGit2,
    visibleTo: [ADMIN, PARTICIPANT],
  },
  {
    title: "Manage users",
    url: DASHBOARD_MANAGE_USERS_PATH,
    icon: Users,
    visibleTo: [ADMIN],
  },
];

export const headerTextMap: Record<string, string> = {
  announcements: "Announcements",
  schedule: "Schedule",
  project: "Project",
  support: "Support",
  settings: "Settings",
  "manage-users": "Manage users",
};
