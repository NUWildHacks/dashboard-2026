"use server";

import { getFirestore } from "firebase-admin/firestore";

import { ADMIN, EVENT_CHECK_INS_COLLECTION, EVENTS_COLLECTION, USERS_COLLECTION } from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { CheckInActionResponse, EventCheckIn, QRCodeScanPayload, User } from "@/types";

import { getCheckInRedirectPath, isAllowedScannableRole, parseScanPayload, WILDHACKS_EVENT_ID } from "./helpers";

export type ProcessCheckInInput = {
  eventId: string;
  scanPayload: QRCodeScanPayload | string;
};

export const processCheckIn = async ({ eventId, scanPayload }: ProcessCheckInInput): Promise<CheckInActionResponse> => {
  const db = getFirestore();
  const now = Date.now();

  try {
    const adminUser = await getAuthenticatedUser(getCheckInRedirectPath());

    const roleError = requireRole(adminUser, ADMIN, "You are not authorized to process check-ins");
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
        error: "Only participants, judges, and mentors can be checked in",
      };
    }

    const existingCheckInSnapshot = await db
      .collection(EVENT_CHECK_INS_COLLECTION)
      .where("event_id", "==", normalizedEventId)
      .where("user_id", "==", payload.user_id)
      .limit(1)
      .get();

    if (!existingCheckInSnapshot.empty) {
      const existingCheckInDoc = existingCheckInSnapshot.docs[0];
      const existingCheckIn = {
        id: existingCheckInDoc.id,
        ...existingCheckInDoc.data(),
      } as EventCheckIn;

      return {
        success: true,
        check_in: existingCheckIn,
        already_checked_in: true,
      };
    }

    const checkInDocRef = db.collection(EVENT_CHECK_INS_COLLECTION).doc();
    const checkInRecord: EventCheckIn = {
      id: checkInDocRef.id,
      event_id: normalizedEventId,
      user_id: payload.user_id,
      checked_in_at: now,
      checked_in_by: adminUser.id,
      scan_payload: payload,
      created_at: now,
      updated_at: now,
    };

    await checkInDocRef.set(checkInRecord);

    return {
      success: true,
      check_in: checkInRecord,
      already_checked_in: false,
    };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Process check-in error:", detailedError);

    const isProduction = process.env.APP_ENV === "production";
    const errorMessage = isProduction ? "Unable to process check-in. Please try again." : detailedError;

    return { success: false, error: errorMessage };
  }
};
