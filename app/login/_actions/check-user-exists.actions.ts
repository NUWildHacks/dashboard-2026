"use server";

import { getFirestore } from "firebase-admin/firestore";
import { cookies } from "next/headers";

import firebaseAdmin from "@/config/firebase-admin";
import { USERS_COLLECTION, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS, SESSION_EXPIRES_IN } from "@/constants";
import { verifySession } from "@/lib";
import type { ActionResult } from "@/types";

export const createVerifiedSession = async (idToken: string): Promise<ActionResult> => {
  try {
    const adminAuth = firebaseAdmin.auth();
    const cookieStore = await cookies();

    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: SESSION_EXPIRES_IN });
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, SESSION_COOKIE_OPTIONS);

    const userInfo = await verifySession();
    if (!userInfo) return { success: false, error: "Failed to verify session." };

    const db = getFirestore();
    const userDocSnapshot = await db.collection(USERS_COLLECTION).doc(userInfo.id).get();

    if (!userDocSnapshot.exists) {
      cookieStore.delete(SESSION_COOKIE_NAME);
      return { success: false, error: "Registration is closed! Check back in the future for WildHacks 2027." };
    }

    return { success: true };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
    console.error(errorMessage);
    return { success: false, error: errorMessage };
  }
};
