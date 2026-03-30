"use server";

import firebaseAdmin from "@/config/firebase-admin";
import type { ActionResult } from "@/types";

import { findUserByEmail } from "../lib";

export type LinkAccountResult = ActionResult & {
  customToken?: string;
  email?: string;
};

/**
 * Get a custom token for an existing account by email.
 * This is called when a user tries to sign in with a provider but an account
 * with the same email already exists with a different provider.
 * The client will use this custom token to sign in, then link the new provider.
 *
 * @param email - The email address to find the existing account
 * @returns ActionResult with success status and a custom token for the existing account
 */
export const getCustomTokenForExistingAccount = async (email: string): Promise<LinkAccountResult> => {
  try {
    const adminAuth = firebaseAdmin.auth();

    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      return {
        success: false,
        error: "No existing account found with this email address.",
      };
    }

    const customToken = await adminAuth.createCustomToken(existingUser.uid);

    return {
      success: true,
      customToken,
      email: existingUser.email || email,
    };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Get custom token error:", detailedError);

    const isProduction = process.env.APP_ENV === "production";
    const errorMessage = isProduction ? "An unknown error occurred. Please try again." : detailedError;

    return {
      success: false,
      error: errorMessage,
    };
  }
};
