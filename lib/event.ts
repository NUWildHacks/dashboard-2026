"use server";

import { getFirestore } from "firebase-admin/firestore";

import { EVENT_DOC, METADATA_COLLECTION } from "@/constants/db";

export default async function getEventDocSnapshot() {
  const db = getFirestore();

  const eventDocRef = db.collection(METADATA_COLLECTION).doc(EVENT_DOC);

  const eventDocSnapshot = await eventDocRef.get();

  return eventDocSnapshot;
}
