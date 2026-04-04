import {
  DASHBOARD_MANAGE_USERS_PATH,
  DASHBOARD_PATH,
  DASHBOARD_SCHEDULE_PATH,
  DASHBOARD_SETTINGS_PATH,
  DISCORD_INVITE_PATH,
  ROOT_PATH,
} from "@/constants";

/**
 * Validates and sanitizes a redirect path to prevent open-redirect vulnerabilities.
 * Only allows relative paths (starting with /) and rejects absolute URLs.
 */
export const validateRedirectPath = (path: string | null): string => {
  const whitelistedPaths: string[] = [
    DASHBOARD_PATH,
    DASHBOARD_SCHEDULE_PATH,
    DASHBOARD_SETTINGS_PATH,
    DISCORD_INVITE_PATH,
    DASHBOARD_MANAGE_USERS_PATH,
    ROOT_PATH,
  ];

  if (path && whitelistedPaths.includes(path)) {
    return path;
  }

  return DASHBOARD_PATH;
};
