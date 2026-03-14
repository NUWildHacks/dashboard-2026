"use server";

import { FirebaseAppError } from "firebase-admin/app";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import firebaseAdmin from "@/config/firebase-admin";
import { ROOT_PATH, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS, SESSION_EXPIRES_IN } from "@/constants";
import type { User } from "@/types";

/**
 * Create a session cookie from a Firebase ID token.
 * Sets the session cookie in the response with configured expiration and options.
 *
 * @param idToken - Firebase ID token string from the client
 * @returns Promise that resolves when the session cookie is created
 * @throws {Error} If session cookie creation fails
 * @example
 * ```ts
 * // In a login API route
 * const idToken = request.body.idToken;
 * await createSession(idToken);
 * // Session cookie is now set in the response
 * ```
 */
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

/**
 * Verify the current session cookie and return the user ID.
 * Validates the session cookie and extracts the user ID from the payload.
 * Returns null if the session is invalid or missing.
 *
 * @returns Promise resolving to the user ID if session is valid, null otherwise
 * @example
 * ```ts
 * const userId = await verifySession();
 * if (!userId) {
 *   redirect('/login');
 * }
 * // User is authenticated, proceed with userId
 * ```
 */
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

    return { id: payload.uid, email: payload.email } as Pick<User, "id" | "email">;
  } catch (e) {
    const errorMessage = e instanceof FirebaseAppError || e instanceof Error ? e.message : "An unknown error occurred";
    console.error(errorMessage);

    return null;
  }
}

/**
 * Delete the current session and revoke refresh tokens.
 * Removes the session cookie and revokes all refresh tokens for the user.
 * Always redirects to the root path after execution.
 *
 * @returns Promise that resolves after session deletion (always redirects)
 * @example
 * ```ts
 * // In a logout handler
 * await deleteSession();
 * // User is logged out and redirected to home page
 * ```
 */
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
