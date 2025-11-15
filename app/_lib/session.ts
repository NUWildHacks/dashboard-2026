"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import firebaseAdmin from "@/config/firebase-admin";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS, SESSION_EXPIRES_IN } from "@/constants/cookie";
import { LOGIN_PATH, ROOT_PATH } from "@/constants/routes";
import type User from "@/types/user";

export async function createSession(idToken: string) {
  try {
    const adminAuth = firebaseAdmin.auth();
    const cookieStore = await cookies();

    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: SESSION_EXPIRES_IN });
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, SESSION_COOKIE_OPTIONS);
  } catch (e) {
    console.error("Failed to create session", e);

    throw e;
  }
}

export async function verifySession() {
  try {
    const adminAuth = firebaseAdmin.auth();
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie) throw new Error("Could not find session cookie");

    const payload = await adminAuth.verifySessionCookie(sessionCookie, true);
    if (!payload) throw new Error("Could not verify session cookie");

    return payload.uid as User["id"];
  } catch (e) {
    console.error("Failed to verify session", e);

    redirect(LOGIN_PATH);
  }
}

export async function updateSession() {
  try {
    const adminAuth = firebaseAdmin.auth();
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie) throw new Error("Could not find session cookie");

    const payload = await adminAuth.verifySessionCookie(sessionCookie, true);
    if (!payload) throw new Error("Could not verify session cookie");

    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, SESSION_COOKIE_OPTIONS);
  } catch (e) {
    console.error("Failed to update session", e);

    cookieStore.delete(SESSION_COOKIE_NAME);
    redirect(LOGIN_PATH);
  }
}

export async function deleteSession() {
  try {
    const adminAuth = firebaseAdmin.auth();
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie) throw new Error("Could not find session cookie");

    const payload = await adminAuth.verifySessionCookie(sessionCookie, true);
    if (!payload) throw new Error("Could not verify session cookie");

    await adminAuth.revokeRefreshTokens(payload.sub);

    cookieStore.delete(SESSION_COOKIE_NAME);
    redirect(ROOT_PATH);
  } catch (e) {
    console.error("Failed to delete session", e);

    cookieStore.delete(SESSION_COOKIE_NAME);
    redirect(LOGIN_PATH);
  }
}
