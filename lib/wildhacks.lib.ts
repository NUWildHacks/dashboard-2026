"use server";

import { getFirestore } from "firebase-admin/firestore";

import { WILDHACKS_COLLECTION, WILDHACKS_CONFIG_DOC, WILDHACKS_STATISTICS_DOC } from "@/constants/db.constants";

/**
 * Get the WildHacks configuration document snapshot from Firestore.
 * Throws an error if the document does not exist.
 *
 * @returns Promise resolving to the Firestore document snapshot containing WildHacks configuration
 * @throws {Error} If the configuration document is not found
 * @example
 * ```ts
 * const configSnapshot = await getConfigDocSnapshot();
 * const config = configSnapshot.data() as WildHacksConfig;
 * console.log(config.start_time, config.end_time);
 * ```
 */
const getConfigDocSnapshot = async () => {
  const db = getFirestore();

  const configDocRef = db.collection(WILDHACKS_COLLECTION).doc(WILDHACKS_CONFIG_DOC);

  const configDocSnapshot = await configDocRef.get();

  if (!configDocSnapshot.exists) {
    throw new Error("WildHacks configuration document not found");
  }

  return configDocSnapshot;
};

/**
 * Get the WildHacks statistics document snapshot from Firestore.
 * Throws an error if the document does not exist.
 *
 * @returns Promise resolving to the Firestore document snapshot containing WildHacks statistics
 * @throws {Error} If the statistics document is not found
 * @example
 * ```ts
 * const statsSnapshot = await getStatisticsDocSnapshot();
 * const stats = statsSnapshot.data() as WildHacksStatistics;
 * console.log(stats.participants, stats.projects);
 * ```
 */
const getStatisticsDocSnapshot = async () => {
  const db = getFirestore();

  const statisticsDocRef = db.collection(WILDHACKS_COLLECTION).doc(WILDHACKS_STATISTICS_DOC);

  const statisticsDocSnapshot = await statisticsDocRef.get();

  if (!statisticsDocSnapshot.exists) {
    throw new Error("WildHacks statistics document not found");
  }

  return statisticsDocSnapshot;
};

export { getConfigDocSnapshot, getStatisticsDocSnapshot };
