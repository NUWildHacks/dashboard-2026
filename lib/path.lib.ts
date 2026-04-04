import { DASHBOARD_PATH, PROTECTED_ROUTES } from "@/constants";

/**
 * Validates and sanitizes a redirect path to prevent open-redirect vulnerabilities.
 * Only allows paths that are in PROTECTED_ROUTES (the canonical list of auth-gated routes).
 */
export const validateRedirectPath = (path: string | null): string => {
  if (path && (PROTECTED_ROUTES as readonly string[]).includes(path)) {
    return path;
  }

  return DASHBOARD_PATH;
};
