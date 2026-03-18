"use server";

import { getFirestore } from "firebase-admin/firestore";

import { ADMIN, EVENTS_COLLECTION, MEAL_EXCHANGES_COLLECTION } from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { GetMealExchangesActionResponse, MealExchange } from "@/types";

import { getCheckInRedirectPath } from "./helpers";

export type GetRecentMealExchangesInput = {
  eventId: string;
  limitCount?: number;
};

const normalizeLimit = (limitCount?: number): number => {
  if (!limitCount || Number.isNaN(limitCount)) return 25;

  const clampedLimit = Math.max(1, Math.min(100, Math.floor(limitCount)));
  return clampedLimit;
};

export const getRecentMealExchanges = async ({
  eventId,
  limitCount,
}: GetRecentMealExchangesInput): Promise<GetMealExchangesActionResponse> => {
  const db = getFirestore();

  try {
    const user = await getAuthenticatedUser(getCheckInRedirectPath());

    const roleError = requireRole(user, ADMIN, "You are not authorized to view meal exchanges");
    if (roleError) return roleError;

    const normalizedEventId = eventId.trim();
    if (!normalizedEventId) {
      return { success: false, error: "Event ID is required" };
    }

    const eventDocSnapshot = await db.collection(EVENTS_COLLECTION).doc(normalizedEventId).get();
    if (!eventDocSnapshot.exists) {
      return { success: false, error: "Selected event does not exist" };
    }

    const mealExchangesSnapshot = await db
      .collection(MEAL_EXCHANGES_COLLECTION)
      .where("event_id", "==", normalizedEventId)
      .get();

    const mealExchanges = mealExchangesSnapshot.docs
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as MealExchange
      )
      .sort((a, b) => b.exchanged_at - a.exchanged_at)
      .slice(0, normalizeLimit(limitCount));

    return {
      success: true,
      meal_exchanges: mealExchanges,
    };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Get recent meal exchanges error:", detailedError);

    const isProduction = process.env.APP_ENV === "production";
    const errorMessage = isProduction ? "Unable to retrieve meal exchanges. Please try again." : detailedError;

    return { success: false, error: errorMessage };
  }
};
