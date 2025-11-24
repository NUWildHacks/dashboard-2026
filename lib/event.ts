"use server";

import { getFirestore } from "firebase-admin/firestore";

import { EVENT_COLLECTION, EVENT_CONFIG_DOC, EVENT_STATISTICS_DOC } from "@/constants/db";

export async function getEventConfigDocSnapshot() {
  const db = getFirestore();

  const eventDocRef = db.collection(EVENT_COLLECTION).doc(EVENT_CONFIG_DOC);

  const eventDocSnapshot = await eventDocRef.get();

  return eventDocSnapshot;
}

export async function getEventStatisticsDocSnapshot() {
  const db = getFirestore();

  const eventStatisticsDocRef = db.collection(EVENT_COLLECTION).doc(EVENT_STATISTICS_DOC);

  const eventStatisticsDocSnapshot = await eventStatisticsDocRef.get();

  return eventStatisticsDocSnapshot;
}
