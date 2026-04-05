import {
  Calendar,
  Home,
  Users,
  TableCellsMerge,
  BookOpenCheck,
  GraduationCap,
  Headset,
  SquareCode,
} from "lucide-react";

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
  DASHBOARD_MENTORING_PATH,
  VIRTUAL_ZOOM_JUDGING_PATH,
  DEVPOST_PATH,
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
  {
    title: "Mentoring",
    url: DASHBOARD_MENTORING_PATH,
    icon: GraduationCap,
    visibleTo: [JUDGE_AND_MENTOR],
  },
  {
    title: "View Devpost",
    url: DEVPOST_PATH,
    icon: SquareCode,
    visibleTo: [PARTICIPANT],
  },
  {
    title: "Virtual Judging Zoom",
    url: VIRTUAL_ZOOM_JUDGING_PATH,
    icon: Headset,
    visibleTo: [JUDGE, JUDGE_AND_MENTOR],
  },
];

export const HEADER_TEXT_MAP: Record<string, string> = {
  schedule: "Schedule",
  settings: "Settings",
  "manage-users": "Manage users",
  guide: "Guide",
  judging: "Judging",
  mentoring: "Mentoring",
};
