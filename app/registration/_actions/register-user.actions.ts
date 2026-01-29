"use server";

import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import { PermissionCode } from "@/app/dashboard/permission-codes/types";
import {
  PERMISSION_CODES_COLLECTION,
  USERS_COLLECTION,
  PARTICIPANT,
  LOGIN_PATH,
  REGISTRATION_PATH,
  PARTICIPANT_USER_FIELDS,
} from "@/constants";
import { verifySession } from "@/lib";
import type { ActionResult, WildHacksConfig } from "@/types";

import { type RegistrationFormSchema } from "../_schemas/registration-form.schemas";

export type RegisterUserResult = ActionResult<RegistrationFormSchema>;

export const registerUser = async (
  data: RegistrationFormSchema,
  start_time: WildHacksConfig["start_time"],
  end_time: WildHacksConfig["end_time"],
  max_participants: WildHacksConfig["max_participants"],
  registration_deadline: WildHacksConfig["registration_deadline"]
): Promise<RegisterUserResult> => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(REGISTRATION_PATH)}`);

  const db = getFirestore();
  const now = Date.now();

  try {
    if (now >= end_time) {
      throw new Error("The event has ended");
    }

    const { permission_code, ...rest } = data;

    if (now >= registration_deadline && now < start_time) {
      if (!permission_code || permission_code.trim() === "") {
        return {
          success: false,
          error: "Registration deadline has passed. A permission code is required.",
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

      const permissionCodeData = permissionCodeDocSnap.data() as Omit<PermissionCode, "id">;

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

    const participantsDocRefs = db.collection(USERS_COLLECTION).where(PARTICIPANT_USER_FIELDS.role, "==", PARTICIPANT);
    const participantsDocSnapshots = await participantsDocRefs.get();
    if (participantsDocSnapshots.docs.length >= max_participants) {
      throw new Error("The event is full");
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
