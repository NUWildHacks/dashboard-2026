import { Calendar, FolderGit2, Home, Megaphone } from "lucide-react";

import {
  DASHBOARD_ANNOUNCEMENTS_PATH,
  DASHBOARD_PATH,
  DASHBOARD_PROJECT_PATH,
  DASHBOARD_SCHEDULE_PATH,
} from "../../../constants/routes";

export const items = [
  {
    title: "Home",
    url: DASHBOARD_PATH,
    icon: Home,
  },
  {
    title: "Announcements",
    url: DASHBOARD_ANNOUNCEMENTS_PATH,
    icon: Megaphone,
  },
  {
    title: "Schedule",
    url: DASHBOARD_SCHEDULE_PATH,
    icon: Calendar,
  },
  {
    title: "Project",
    url: DASHBOARD_PROJECT_PATH,
    icon: FolderGit2,
  },
];

export const headerTextMap: Record<string, string> = {
  announcements: "Announcements",
  schedule: "Schedule",
  project: "Project",
  support: "Support",
  settings: "Settings",
};
