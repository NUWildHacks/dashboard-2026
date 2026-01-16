"use server";

import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import {
  PERMISSION_CODES_COLLECTION,
  USERS_COLLECTION,
  ONGOING,
  PARTICIPANT,
  LOGIN_PATH,
  REGISTRATION_PATH,
} from "@/constants";
import { verifySession } from "@/lib";
import type { WildHacksConfig } from "@/types";

import { type RegistrationFormSchema } from "../_schemas/registration-form.schemas";
import type { PermissionCode } from "../_types";

export type RegisterUserResult =
  | { success: true }
  | { success: false; error: string; field?: keyof RegistrationFormSchema };

export const registerUser = async (
  data: RegistrationFormSchema,
  state: WildHacksConfig["state"]
): Promise<RegisterUserResult> => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(REGISTRATION_PATH)}`);

  const db = getFirestore();
  const now = Date.now();

  try {
    const { permission_code, ...rest } = data;

    if (state === ONGOING) {
      if (!permission_code || permission_code.trim() === "") {
        return {
          success: false,
          error: "Permission code is required for late registration",
          field: "permission_code",
        };
      }

      if (!/^[a-zA-Z0-9]{20}$/.test(permission_code)) {
        return {
          success: false,
          error: "Invalid permission code format",
          field: "permission_code",
        };
      }

      const permissionCodeDocRef = db.collection(PERMISSION_CODES_COLLECTION).doc(permission_code);
      const permissionCodeDocSnap = await permissionCodeDocRef.get();

      if (!permissionCodeDocSnap.exists) {
        return {
          success: false,
          error: "Invalid permission code",
          field: "permission_code",
        };
      }

      const permissionCodeData = permissionCodeDocSnap.data() as PermissionCode;

      if (permissionCodeData.email !== rest.email) {
        return {
          success: false,
          error: "Permission code email does not match registration email",
          field: "permission_code",
        };
      }

      if (permissionCodeData.expires_at <= now) {
        return {
          success: false,
          error: "Permission code has expired",
          field: "permission_code",
        };
      }

      await permissionCodeDocRef.delete();
    }

    const userDocRef = db.collection(USERS_COLLECTION).doc(userId);
    await userDocRef.set({
      ...rest,
      role: PARTICIPANT,
      created_at: now,
      updated_at: now,
    });

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Registration error:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
};
