import { Calendar, Home, Users, TableCellsMerge, BookOpenCheck } from "lucide-react";

import {
  ADMIN,
  JUDGE,
  JUDGE_AND_MENTOR,
  PARTICIPANT,
  DASHBOARD_MANAGE_USERS_PATH,
  DASHBOARD_PATH,
  DASHBOARD_SCHEDULE_PATH,
  GUIDE_PATH,
  DASHBOARD_JUDGING_PATH,
} from "@/constants";

import type { SidebarItem } from "./types";

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: "Home",
    url: DASHBOARD_PATH,
    icon: Home,
    visibleTo: [ADMIN, PARTICIPANT, JUDGE, JUDGE_AND_MENTOR],
  },
  {
    title: "Schedule",
    url: DASHBOARD_SCHEDULE_PATH,
    icon: Calendar,
    visibleTo: [ADMIN, PARTICIPANT, JUDGE, JUDGE_AND_MENTOR],
  },
  {
    title: "Manage users",
    url: DASHBOARD_MANAGE_USERS_PATH,
    icon: Users,
    visibleTo: [ADMIN],
  },
  {
    title: "Guide",
    url: GUIDE_PATH,
    icon: TableCellsMerge,
    visibleTo: [ADMIN, PARTICIPANT, JUDGE, JUDGE_AND_MENTOR],
  },
  {
    title: "Judging",
    url: DASHBOARD_JUDGING_PATH,
    icon: BookOpenCheck,
    visibleTo: [JUDGE, JUDGE_AND_MENTOR],
  },
];

export const HEADER_TEXT_MAP: Record<string, string> = {
  schedule: "Schedule",
  support: "Support",
  settings: "Settings",
  "manage-users": "Manage users",
  guide: "Guide",
  judging: "Judging",
};
