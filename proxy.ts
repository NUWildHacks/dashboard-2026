import { decodeJwt } from "jose";
import { NextRequest, NextResponse } from "next/server";

import {
  DASHBOARD_PATH,
  DASHBOARD_SCHEDULE_PATH,
  DASHBOARD_SETTINGS_PATH,
  DASHBOARD_SUPPORT_PATH,
  DASHBOARD_JUDGING_PATH,
  LOGIN_PATH,
  REGISTRATION_PATH,
  SESSION_COOKIE_NAME,
} from "@/constants";
import { validateRedirectPath } from "@/lib";

/**
 * Decodes a JWT token and checks if it's expired.
 * This is a lightweight check that only decodes the payload without verifying the signature.
 * Full signature verification is done later in verifySession() using Firebase Admin SDK.
 * Uses jose library which is compatible with Edge Runtime.
 *
 * @param token - JWT token string
 * @returns true if token is expired or invalid, false if still valid
 */
function isTokenExpired(token: string): boolean {
  try {
    const claims = decodeJwt(token);

    if (!claims.exp) {
      return true;
    }

    const expirationTime = claims.exp * 1000;
    const currentTime = Date.now();

    return currentTime >= expirationTime;
  } catch {
    return true;
  }
}

export async function proxy(req: NextRequest) {
  const currentPath = req.nextUrl.pathname;
  const isProtectedRoute =
    currentPath === REGISTRATION_PATH ||
    currentPath === DASHBOARD_PATH ||
    currentPath === DASHBOARD_SCHEDULE_PATH ||
    currentPath === DASHBOARD_SUPPORT_PATH ||
    currentPath === DASHBOARD_SETTINGS_PATH ||
    currentPath === DASHBOARD_JUDGING_PATH;

  if (isProtectedRoute) {
    const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie || isTokenExpired(sessionCookie)) {
      const loginUrl = new URL(LOGIN_PATH, req.url);
      const redirectPath = validateRedirectPath(req.nextUrl.pathname);
      loginUrl.searchParams.set("redirect", redirectPath);

      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
