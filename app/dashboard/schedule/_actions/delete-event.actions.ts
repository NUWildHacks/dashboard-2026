"use server";

import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import { LOGIN_PATH, ADMIN, EVENTS_COLLECTION, DASHBOARD_SCHEDULE_PATH } from "@/constants";
import { getUserDocSnapshot, verifySession } from "@/lib";
import type { ActionResult, User } from "@/types";

import { Event } from "../_types";

export type DeleteEventResult = ActionResult;

export const deleteEvent = async (eventId: Event["id"]): Promise<DeleteEventResult> => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_SCHEDULE_PATH)}`);

  const db = getFirestore();

  try {
    const userDocSnapshot = await getUserDocSnapshot(userId);
    if (!userDocSnapshot.exists) {
      return {
        success: false,
        error: "User document not found",
      };
    }

    const { role } = userDocSnapshot.data() as Omit<User, "id">;
    if (role !== ADMIN) {
      return {
        success: false,
        error: "You are not authorized to delete events",
      };
    }

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
