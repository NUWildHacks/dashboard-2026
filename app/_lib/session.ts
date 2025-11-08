"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import firebaseAdmin from "@/config/firebase-admin";
import { User } from "@/types/user";

import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS, SESSION_EXPIRES_IN } from "./constants";

export async function createSession(idToken: string) {
  const adminAuth = firebaseAdmin.auth();
  const cookieStore = await cookies();

  try {
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: SESSION_EXPIRES_IN });
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, SESSION_COOKIE_OPTIONS);
  } catch (e) {
    console.error("Failed to create session", e);
    throw e;
  }
}

async function getSessionPayload() {
  const adminAuth = firebaseAdmin.auth();
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  try {
    const payload = await adminAuth.verifySessionCookie(sessionCookie, true);
    return payload;
  } catch (e) {
    console.error("Failed to verify session", e);
    return null;
  }
}

export async function verifySession() {
  const payload = await getSessionPayload();

  if (!payload) return null;

  return {
    id: payload.uid,
    email: payload.email,
  } as User;
}

export async function updateSession() {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return;

  const payload = await getSessionPayload();
  if (!payload) {
    cookieStore.delete(SESSION_COOKIE_NAME);
    return;
  }

  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, SESSION_COOKIE_OPTIONS);
}

export async function deleteSession() {
  const cookieStore = await cookies();

  const payload = await getSessionPayload();

  if (payload) {
    try {
      const adminAuth = firebaseAdmin.auth();
      await adminAuth.revokeRefreshTokens(payload.sub);
    } catch (e) {
      console.error("Failed to revoke refresh tokens", e);
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/");
}
