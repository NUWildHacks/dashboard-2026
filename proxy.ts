import { NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/constants/cookie";

import { DASHBOARD_PATH, LOGIN_PATH, REGISTRATION_PATH } from "./constants/routes";

export async function proxy(req: NextRequest) {
  const currentPath = req.nextUrl.pathname;
  const isProtectedRoute = currentPath === DASHBOARD_PATH || currentPath === REGISTRATION_PATH;

  if (isProtectedRoute) {
    const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      const loginUrl = new URL(LOGIN_PATH, req.url);
      loginUrl.searchParams.set("redirect", req.nextUrl.pathname);

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
