import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const SESSION_EXPIRES_IN = 5 * 24 * 60 * 60 * 1000;

export const SESSION_COOKIE_NAME = "session";

export const SESSION_COOKIE_OPTIONS: Partial<ResponseCookie> = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: SESSION_EXPIRES_IN,
  sameSite: "strict",
  path: "/",
} as const;
