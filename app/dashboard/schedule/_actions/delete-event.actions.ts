"use server";

import { getFirestore } from "firebase-admin/firestore";

import { EVENTS_COLLECTION, DASHBOARD_SCHEDULE_PATH, ADMIN, LOGIN_PATH } from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { ActionResult } from "@/types";

import { Event } from "../_types";

export type DeleteEventResult = ActionResult;

export const deleteEvent = async (eventId: Event["id"]): Promise<DeleteEventResult> => {
  const db = getFirestore();

  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_SCHEDULE_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);

    const roleError = requireRole(user, ADMIN, "You are not authorized to delete events");
    if (roleError) return roleError;

    const eventDocRef = db.collection(EVENTS_COLLECTION).doc(eventId);
    const eventDocSnapshot = await eventDocRef.get();
    if (!eventDocSnapshot.exists) {
      return {
        success: false,
        error: "Event not found",
      };
    }

    await eventDocRef.delete();

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Delete event error:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
};
