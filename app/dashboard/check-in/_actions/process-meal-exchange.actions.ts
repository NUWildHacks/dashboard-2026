"use server";

import { getFirestore } from "firebase-admin/firestore";

import { ADMIN, EVENTS_COLLECTION, MEAL_EXCHANGES_COLLECTION, USERS_COLLECTION } from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { MealExchange, MealExchangeActionResponse, QRCodeScanPayload, User } from "@/types";

import { getCheckInRedirectPath, isAllowedScannableRole, parseScanPayload } from "./helpers";

export type ProcessMealExchangeInput = {
  eventId: string;
  scanPayload: QRCodeScanPayload | string;
};

export const processMealExchange = async ({
  eventId,
  scanPayload,
}: ProcessMealExchangeInput): Promise<MealExchangeActionResponse> => {
  const db = getFirestore();
  const now = Date.now();

  try {
    const adminUser = await getAuthenticatedUser(getCheckInRedirectPath());

    const roleError = requireRole(adminUser, ADMIN, "You are not authorized to process meal exchanges");
    if (roleError) return roleError;

    const normalizedEventId = eventId.trim();
    if (!normalizedEventId) {
      return { success: false, error: "Event ID is required" };
    }

    const eventDocSnapshot = await db.collection(EVENTS_COLLECTION).doc(normalizedEventId).get();
    if (!eventDocSnapshot.exists) {
      return { success: false, error: "Selected event does not exist" };
    }

    const parsedPayloadResult = parseScanPayload(scanPayload);
    if (!parsedPayloadResult.success) {
      return { success: false, error: parsedPayloadResult.error };
    }

    const payload = parsedPayloadResult.payload;

    const userDocSnapshot = await db.collection(USERS_COLLECTION).doc(payload.user_id).get();
    if (!userDocSnapshot.exists) {
      return { success: false, error: "Scanned user does not exist" };
    }

    const scannedUser = { id: userDocSnapshot.id, ...userDocSnapshot.data() } as User;
    if (!isAllowedScannableRole(scannedUser.role)) {
      return {
        success: false,
        error: "Only participants, judges, and mentors can exchange meals",
      };
    }

    const existingMealExchangeSnapshot = await db
      .collection(MEAL_EXCHANGES_COLLECTION)
      .where("event_id", "==", normalizedEventId)
      .where("user_id", "==", payload.user_id)
      .limit(1)
      .get();

    if (!existingMealExchangeSnapshot.empty) {
      const existingMealExchangeDoc = existingMealExchangeSnapshot.docs[0];
      const existingMealExchange = {
        id: existingMealExchangeDoc.id,
        ...existingMealExchangeDoc.data(),
      } as MealExchange;

      return {
        success: true,
        meal_exchange: existingMealExchange,
        already_exchanged: true,
      };
    }

    const mealExchangeDocRef = db.collection(MEAL_EXCHANGES_COLLECTION).doc();
    const mealExchangeRecord: MealExchange = {
      id: mealExchangeDocRef.id,
      event_id: normalizedEventId,
      user_id: payload.user_id,
      exchanged_at: now,
      exchanged_by: adminUser.id,
      scan_payload: payload,
      created_at: now,
      updated_at: now,
    };

    await mealExchangeDocRef.set(mealExchangeRecord);

    return {
      success: true,
      meal_exchange: mealExchangeRecord,
      already_exchanged: false,
    };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Process meal exchange error:", detailedError);

    const isProduction = process.env.APP_ENV === "production";
    const errorMessage = isProduction ? "Unable to process meal exchange. Please try again." : detailedError;

    return { success: false, error: errorMessage };
  }
};
