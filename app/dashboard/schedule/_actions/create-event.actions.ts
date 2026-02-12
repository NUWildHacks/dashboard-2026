"use server";

import { getFirestore } from "firebase-admin/firestore";

import { ADMIN, DASHBOARD_SCHEDULE_PATH, EVENTS_COLLECTION, LOGIN_PATH } from "@/constants";
import { combineDateAndTime, getAuthenticatedUser, parseDateLabel, requireRole } from "@/lib";
import type { ActionResult, WildHacksConfig } from "@/types";

import { type CreateEventDialogSchema } from "../_schemas/create-event-dialog.schemas";

export type CreateEventResult = ActionResult<CreateEventDialogSchema>;

export const createEvent = async (
  data: CreateEventDialogSchema,
  wildHacksStartTime: WildHacksConfig["start_time"],
  wildHacksEndTime: WildHacksConfig["end_time"]
): Promise<CreateEventResult> => {
  const db = getFirestore();
  const now = Date.now();

  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_SCHEDULE_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);

    const roleError = requireRole(user, ADMIN, "You are not authorized to create events");
    if (roleError) return roleError;

    const { day, start_time, end_time } = data;

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

    if (startTimeMs < wildHacksStartTime) {
      return {
        success: false,
        error: "Event cannot start before WildHacks start time",
        field: "start_time" as const,
      };
    }

    if (endTimeMs > wildHacksEndTime) {
      return {
        success: false,
        error: "Event cannot end after WildHacks end time",
        field: "end_time" as const,
      };
    }

    await db
      .collection(EVENTS_COLLECTION)
      .doc()
      .set({
        ...data,
        start_time: startTimeMs,
        end_time: endTimeMs,
        created_at: now,
        updated_at: now,
      });

    return { success: true };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Create event error:", detailedError);

    const isProduction = process.env.APP_ENV === "production";
    const errorMessage = isProduction ? "An unknown error occurred. Please try again." : detailedError;

    return { success: false, error: errorMessage };
  }
};
