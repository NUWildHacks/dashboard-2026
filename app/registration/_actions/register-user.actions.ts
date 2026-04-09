"use server";

import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import { USERS_COLLECTION, PARTICIPANT, LOGIN_PATH, REGISTRATION_PATH, PARTICIPANT_USER_FIELDS } from "@/constants";
import { verifySession } from "@/lib";
import type { ActionResult, WildHacksConfig } from "@/types";

import { type RegistrationFormSchema } from "../_schemas/registration-form.schemas";

export type RegisterUserResult = ActionResult<RegistrationFormSchema>;

export const registerUser = async (
  data: RegistrationFormSchema,
  _start_time: WildHacksConfig["start_time"],
  end_time: WildHacksConfig["end_time"],
  max_participants: WildHacksConfig["max_participants"],
  _registration_deadline: WildHacksConfig["registration_deadline"]
): Promise<RegisterUserResult> => {
  const userInfo = await verifySession();
  if (!userInfo) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(REGISTRATION_PATH)}`);

  const { id: userId } = userInfo;

  const db = getFirestore();
  const now = Date.now();

  try {
    if (now >= end_time) {
      throw new Error("The event has ended");
    }

    const { ...rest } = data;

    const participantsDocRefs = db.collection(USERS_COLLECTION).where(PARTICIPANT_USER_FIELDS.role, "==", PARTICIPANT);
    const participantsDocSnapshots = await participantsDocRefs.get();
    if (participantsDocSnapshots.docs.length >= max_participants) {
      throw new Error("The event is full");
    }

    const emailDocSnapshot = await db
      .collection(USERS_COLLECTION)
      .where(PARTICIPANT_USER_FIELDS.email, "==", userInfo.email)
      .limit(1)
      .get();

    const userDocRef = db.collection(USERS_COLLECTION).doc(userId);
    await userDocRef.set({
      ...rest,
      role: PARTICIPANT,
      created_at: now,
      updated_at: now,
    });

    if (!emailDocSnapshot.empty) {
      await emailDocSnapshot.docs[0].ref.delete();
    }

    return { success: true };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Registration error:", detailedError);

    const isProduction = process.env.APP_ENV === "production";
    const errorMessage = isProduction ? "An unknown error occurred. Please try again." : detailedError;

    return {
      success: false,
      error: errorMessage,
    };
  }
};
