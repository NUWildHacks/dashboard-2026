import {
  Calendar,
  Home,
  Users,
  TableCellsMerge,
  BookOpenCheck,
  GraduationCap,
  Headset,
  SquareCode,
  QrCode,
} from "lucide-react";

import {
  ADMIN,
  JUDGE,
  JUDGE_AND_MENTOR,
  PARTICIPANT,
  DASHBOARD_CHECK_IN_PATH,
  DASHBOARD_MANAGE_USERS_PATH,
  DASHBOARD_PATH,
  DASHBOARD_SCHEDULE_PATH,
  GUIDE_PATH,
  DASHBOARD_JUDGING_ROUND_1_PATH,
  DASHBOARD_JUDGING_ROUND_2_PATH,
  DASHBOARD_MENTORING_PATH,
  VIRTUAL_ZOOM_JUDGING_PATH,
  DEVPOST_PATH,
} from "@/constants";

import type { SidebarItem } from "./types";

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: "Home",
    hasSubItems: false,
    url: DASHBOARD_PATH,
    icon: Home,
    visibleTo: [ADMIN, PARTICIPANT, JUDGE, JUDGE_AND_MENTOR],
  },
  {
    title: "Schedule",
    hasSubItems: false,
    url: DASHBOARD_SCHEDULE_PATH,
    icon: Calendar,
    visibleTo: [ADMIN, PARTICIPANT, JUDGE, JUDGE_AND_MENTOR],
  },
  {
    title: "Manage users",
    hasSubItems: false,
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
    title: "Mentoring",
    url: DASHBOARD_MENTORING_PATH,
    icon: GraduationCap,
    visibleTo: [JUDGE_AND_MENTOR],
  },
  {
    title: "Judging",
    hasSubItems: true,
    icon: BookOpenCheck,
    visibleTo: [JUDGE, JUDGE_AND_MENTOR],
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
  settings: "Settings",
  "manage-users": "Manage users",
  "check-in": "Check-in",
  guide: "Guide",
  "judging-round-1": "Judging Round 1",
  "judging-round-2": "Judging Round 2",
  mentoring: "Mentoring",
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const RESUME_MIME_TYPE = "application/pdf";
