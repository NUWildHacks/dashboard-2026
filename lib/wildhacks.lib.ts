"use server";

import { getFirestore } from "firebase-admin/firestore";

import { WILDHACKS_COLLECTION, WILDHACKS_CONFIG_DOC, WILDHACKS_SECRETS_DOC } from "@/constants";

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

const getSecretsDocSnapshot = async () => {
  const db = getFirestore();

  const secretsDocRef = db.collection(WILDHACKS_COLLECTION).doc(WILDHACKS_SECRETS_DOC);

  const secretsDocSnapshot = await secretsDocRef.get();

  if (!secretsDocSnapshot.exists) {
    throw new Error("WildHacks secrets document not found");
  }

  return secretsDocSnapshot;
};

export { getConfigDocSnapshot, getSecretsDocSnapshot };
