"use server";

import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import { ADMIN, DASHBOARD_SCHEDULE_PATH, EVENTS_COLLECTION, LOGIN_PATH, USERS_COLLECTION } from "@/constants";
import { combineDateAndTime, parseDateLabel, verifySession } from "@/lib";
import type { ActionResult, User } from "@/types";

import { type CreateEventDialogSchema } from "../_schemas/create-event-dialog.schemas";

export type CreateEventResult = ActionResult<CreateEventDialogSchema>;

export const createEvent = async (data: CreateEventDialogSchema): Promise<CreateEventResult> => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_SCHEDULE_PATH)}`);

  const db = getFirestore();
  const now = Date.now();

  try {
    const userDocRef = db.collection(USERS_COLLECTION).doc(userId);
    const userDocSnapshot = await userDocRef.get();

    if (!userDocSnapshot.exists) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const { role } = userDocSnapshot.data() as Omit<User, "id">;
    if (role !== ADMIN) {
      return {
        success: false,
        error: "You are not authorized to create events",
      };
    }

    const eventDocRef = db.collection(EVENTS_COLLECTION).doc();

    const { day, start_time, end_time, ...rest } = data;

    const dayDate = parseDateLabel(day);
    if (!dayDate) {
      return {
        success: false,
        error: "Invalid day selected",
        field: "day" as const,
      };
    }

    const startTimeMs = combineDateAndTime(dayDate, start_time);
    const endTimeMs = combineDateAndTime(dayDate, end_time);

    if (startTimeMs === 0 || endTimeMs === 0) {
      return {
        success: false,
        error: "Invalid time format",
        field: startTimeMs === 0 ? ("start_time" as const) : ("end_time" as const),
      };
    }

    await eventDocRef.set({
      ...rest,
      day,
      start_time: startTimeMs,
      end_time: endTimeMs,
      created_at: now,
      updated_at: now,
    });

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Create event error:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
};
