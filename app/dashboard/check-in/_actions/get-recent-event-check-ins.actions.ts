"use server";

import { getFirestore } from "firebase-admin/firestore";

import { ADMIN, EVENT_CHECK_INS_COLLECTION, EVENTS_COLLECTION } from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { EventCheckIn, GetEventCheckInsActionResponse } from "@/types";

import { getCheckInRedirectPath } from "./helpers";

export type GetRecentEventCheckInsInput = {
  eventId: string;
  limitCount?: number;
};

const normalizeLimit = (limitCount?: number): number => {
  if (!limitCount || Number.isNaN(limitCount)) return 25;

  const clampedLimit = Math.max(1, Math.min(100, Math.floor(limitCount)));
  return clampedLimit;
};

export const getRecentEventCheckIns = async ({
  eventId,
  limitCount,
}: GetRecentEventCheckInsInput): Promise<GetEventCheckInsActionResponse> => {
  const db = getFirestore();

  try {
    const user = await getAuthenticatedUser(getCheckInRedirectPath());

    const roleError = requireRole(user, ADMIN, "You are not authorized to view check-ins");
    if (roleError) return roleError;

    const normalizedEventId = eventId.trim();
    if (!normalizedEventId) {
      return { success: false, error: "Event ID is required" };
    }

    const eventDocSnapshot = await db.collection(EVENTS_COLLECTION).doc(normalizedEventId).get();
    if (!eventDocSnapshot.exists) {
      return { success: false, error: "Selected event does not exist" };
    }

    const checkInsSnapshot = await db
      .collection(EVENT_CHECK_INS_COLLECTION)
      .where("event_id", "==", normalizedEventId)
      .get();

    const checkIns = checkInsSnapshot.docs
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as EventCheckIn
      )
      .sort((a, b) => b.checked_in_at - a.checked_in_at)
      .slice(0, normalizeLimit(limitCount));

    return {
      success: true,
      check_ins: checkIns,
    };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Get recent event check-ins error:", detailedError);

    const isProduction = process.env.APP_ENV === "production";
    const errorMessage = isProduction ? "Unable to retrieve check-ins. Please try again." : detailedError;

    return { success: false, error: errorMessage };
  }
};
