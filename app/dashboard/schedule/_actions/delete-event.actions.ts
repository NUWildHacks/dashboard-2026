"use server";

import { FirebaseFirestoreError, getFirestore } from "firebase-admin/firestore";

import { EVENTS_COLLECTION, DASHBOARD_SCHEDULE_PATH, ADMIN, LOGIN_PATH } from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { ActionResult } from "@/types";

import type { Event } from "../types";

export type DeleteEventResult = ActionResult;

export const deleteEvent = async (eventId: Event["id"]): Promise<DeleteEventResult> => {
  const db = getFirestore();

  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_SCHEDULE_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);

    const roleError = requireRole(user, ADMIN, "You are not authorized to delete events");
    if (roleError) return roleError;

    await db.collection(EVENTS_COLLECTION).doc(eventId).delete();

    return { success: true };
  } catch (error) {
    let errorMessage;
    if (error instanceof FirebaseFirestoreError || error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "An unknown error occurred";
    }

    console.error("Delete event error:", errorMessage);

    return { success: false, error: errorMessage };
  }
};
