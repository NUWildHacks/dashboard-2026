import { getFirestore } from "firebase-admin/firestore";

import { EVENTS_COLLECTION } from "@/constants";

import type { CheckInEventOption } from "../types";

type CheckInEventDocument = Partial<Omit<CheckInEventOption, "id">>;

const normalizeTimestamp = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  return 0;
};

const normalizeText = (value: unknown, fallback: string): string => {
  if (typeof value === "string") {
    const trimmedValue = value.trim();
    return trimmedValue || fallback;
  }

  return fallback;
};

export const getCheckInEvents = async (): Promise<CheckInEventOption[]> => {
  const db = getFirestore();
  const eventsSnapshot = await db.collection(EVENTS_COLLECTION).get();

  return eventsSnapshot.docs
    .map((eventDocSnapshot) => {
      const eventData = eventDocSnapshot.data() as CheckInEventDocument;

      return {
        id: eventDocSnapshot.id,
        title: normalizeText(eventData.title, "Untitled event"),
        location: normalizeText(eventData.location, "TBD"),
        start_time: normalizeTimestamp(eventData.start_time),
        end_time: normalizeTimestamp(eventData.end_time),
      } satisfies CheckInEventOption;
    })
    .sort((leftEvent, rightEvent) => {
      if (leftEvent.start_time !== rightEvent.start_time) {
        return leftEvent.start_time - rightEvent.start_time;
      }

      return leftEvent.title.localeCompare(rightEvent.title);
    });
};
