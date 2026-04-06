"use server";

import { getFirestore } from "firebase-admin/firestore";

import { ADMIN, EVENT_CHECK_INS_COLLECTION, EVENTS_COLLECTION, USERS_COLLECTION } from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { EventCheckIn, GetEventCheckInsActionResponse, User } from "@/types";

import { getCheckInRedirectPath, WILDHACKS_EVENT_ID } from "./helpers";

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

    // Skip event validation for WildHacks main event
    if (normalizedEventId !== WILDHACKS_EVENT_ID) {
      const eventDocSnapshot = await db.collection(EVENTS_COLLECTION).doc(normalizedEventId).get();
      if (!eventDocSnapshot.exists) {
        return { success: false, error: "Selected event does not exist" };
      }
    }

    // Requires a composite index on (event_id ASC, checked_in_at DESC)
    const checkInsSnapshot = await db
      .collection(EVENT_CHECK_INS_COLLECTION)
      .where("event_id", "==", normalizedEventId)
      .orderBy("checked_in_at", "desc")
      .limit(normalizeLimit(limitCount))
      .get();

    const rawCheckIns = checkInsSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as EventCheckIn
    );

    const userIds = Array.from(new Set(rawCheckIns.map((checkIn) => checkIn.user_id).filter(Boolean)));
    const usersById = new Map<string, User>();

    await Promise.all(
      userIds.map(async (userId) => {
        const userDocSnapshot = await db.collection(USERS_COLLECTION).doc(userId).get();
        if (!userDocSnapshot.exists) return;

        const user = { id: userDocSnapshot.id, ...userDocSnapshot.data() } as User;
        usersById.set(userId, user);
      })
    );

    const checkIns = rawCheckIns.map((checkIn) => {
      const user = usersById.get(checkIn.user_id);
      const fullName = user ? `${user.first_name} ${user.last_name}`.trim() : undefined;

      return {
        ...checkIn,
        scan_payload: {
          ...checkIn.scan_payload,
          full_name: checkIn.scan_payload.full_name ?? (fullName || undefined),
          email: checkIn.scan_payload.email ?? user?.email,
          role: checkIn.scan_payload.role ?? user?.role,
        },
      };
    });

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
