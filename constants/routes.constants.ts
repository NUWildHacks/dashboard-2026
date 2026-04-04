export const ROOT_PATH = "/" as const;

export const REGISTRATION_PATH = "/registration" as const;

export const DASHBOARD_PATH = "/dashboard" as const;
export const DASHBOARD_SCHEDULE_PATH = "/dashboard/schedule" as const;
export const DASHBOARD_MANAGE_USERS_PATH = "/dashboard/manage-users" as const;
export const DASHBOARD_SETTINGS_PATH = "/dashboard/settings" as const;
export const GUIDE_PATH = "/guide" as const;
export const DASHBOARD_JUDGING_PATH = "/dashboard/judging" as const;
export const DASHBOARD_MENTORING_PATH = "/dashboard/mentoring" as const;

export const LOGIN_PATH = "/login" as const;

export const PROTECTED_ROUTES = [
  REGISTRATION_PATH,
  DASHBOARD_PATH,
  DASHBOARD_SCHEDULE_PATH,
  DASHBOARD_MANAGE_USERS_PATH,
  GUIDE_PATH,
  DASHBOARD_JUDGING_PATH,
  DASHBOARD_SETTINGS_PATH,
] as const satisfies readonly string[];

export const WILDHACKS_HOME = "/wildhacks-home" as const;
export const JUDGE_REGISTRATION_PATH = "/judge-registration" as const;
export const TECH_ROOM_FINDER_PATH = "/tech-room-finder" as const;
export const JUDGING_GUIDE_PATH = "/judging-guide" as const;
export const DISCORD_INVITE_PATH = "/discord-invite" as const;
