"use server";

import { getFirestore } from "firebase-admin/firestore";

import { WILDHACKS_COLLECTION, WILDHACKS_CONFIG_DOC, WILDHACKS_STATISTICS_DOC } from "@/constants/db.constants";

export async function getConfigDocSnapshot() {
  const db = getFirestore();

  const configDocRef = db.collection(WILDHACKS_COLLECTION).doc(WILDHACKS_CONFIG_DOC);

  const configDocSnapshot = await configDocRef.get();

  return configDocSnapshot;
}

export async function getStatisticsDocSnapshot() {
  const db = getFirestore();

  const statisticsDocRef = db.collection(WILDHACKS_COLLECTION).doc(WILDHACKS_STATISTICS_DOC);

  const statisticsDocSnapshot = await statisticsDocRef.get();

  return statisticsDocSnapshot;
}
