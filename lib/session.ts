"use server";

import { FirebaseAppError } from "firebase-admin/app";
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
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    console.error(errorMessage);

    throw e;
  }
}

export async function verifySession() {
  const adminAuth = firebaseAdmin.auth();
  const cookieStore = await cookies();

  try {
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie) throw new Error("Could not find session cookie");

    const payload = await adminAuth.verifySessionCookie(sessionCookie, true);
    if (!payload) {
      cookieStore.delete(SESSION_COOKIE_NAME);
      throw new Error("Could not verify session cookie");
    }

    return payload.uid as User["id"];
  } catch (e) {
    const errorMessage = e instanceof FirebaseAppError || e instanceof Error ? e.message : "An unknown error occurred";
    console.error(errorMessage);

    return null;
  }
}

export async function updateSession() {
  const adminAuth = firebaseAdmin.auth();
  const cookieStore = await cookies();

  try {
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie) throw new Error("Could not find session cookie");

    const payload = await adminAuth.verifySessionCookie(sessionCookie, true);
    if (!payload) {
      cookieStore.delete(SESSION_COOKIE_NAME);
      throw new Error("Could not verify session cookie");
    }

    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, SESSION_COOKIE_OPTIONS);
  } catch (e) {
    const errorMessage = e instanceof FirebaseAppError || e instanceof Error ? e.message : "An unknown error occurred";
    console.error(errorMessage);

    redirect(LOGIN_PATH);
  }
}

export async function deleteSession() {
  const adminAuth = firebaseAdmin.auth();
  const cookieStore = await cookies();

  try {
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie) throw new Error("Could not find session cookie");

    cookieStore.delete(SESSION_COOKIE_NAME);

    const payload = await adminAuth.verifySessionCookie(sessionCookie, true);
    if (!payload) throw new Error("Could not verify session cookie");

    await adminAuth.revokeRefreshTokens(payload.sub);
  } catch (e) {
    const errorMessage = e instanceof FirebaseAppError || e instanceof Error ? e.message : "An unknown error occurred";
    console.error(errorMessage);
  } finally {
    redirect(ROOT_PATH);
  }
}
