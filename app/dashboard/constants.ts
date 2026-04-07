import { BookOpenCheck, Calendar, Home, Users } from "lucide-react";

import {
  ADMIN,
  JUDGE,
  MENTOR,
  PARTICIPANT,
  DASHBOARD_MANAGE_USERS_PATH,
  DASHBOARD_PATH,
  DASHBOARD_SCHEDULE_PATH,
  DASHBOARD_JUDGING_ROUND_1_PATH,
  DASHBOARD_JUDGING_ROUND_2_PATH,
} from "@/constants";

import type { SidebarItem } from "./types";

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: "Home",
    hasSubItems: false,
    url: DASHBOARD_PATH,
    icon: Home,
    visibleTo: [ADMIN, PARTICIPANT, JUDGE, MENTOR],
  },
  {
    title: "Schedule",
    hasSubItems: false,
    url: DASHBOARD_SCHEDULE_PATH,
    icon: Calendar,
    visibleTo: [ADMIN, PARTICIPANT, JUDGE, MENTOR],
  },
  {
    title: "Manage users",
    hasSubItems: false,
    url: DASHBOARD_MANAGE_USERS_PATH,
    icon: Users,
    visibleTo: [ADMIN],
  },
  {
    title: "Judging",
    hasSubItems: true,
    icon: BookOpenCheck,
    visibleTo: [JUDGE],
    subItems: [
      {
        title: "Round 1",
        url: DASHBOARD_JUDGING_ROUND_1_PATH,
      },
      {
        title: "Round 2",
        url: DASHBOARD_JUDGING_ROUND_2_PATH,
      },
    ],
  },
];

export const HEADER_TEXT_MAP: Record<string, string> = {
  schedule: "Schedule",
  support: "Support",
  settings: "Settings",
  "manage-users": "Manage users",
  "judging-round-1": "Judging Round 1",
  "judging-round-2": "Judging Round 2",
};
