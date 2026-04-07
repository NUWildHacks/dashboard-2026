"use server";

import { getFirestore } from "firebase-admin/firestore";

import { RESUMES_COLLECTION } from "@/constants";

import { ResumeMetadata } from "../types";

/**
 * Get the resume metadata from Firestore.
 * Throws an error if the document does not exist.
 *
 * @returns Promise resolving to the Firestore document snapshot containing resume metadata
 * @returns null if the resume document is not found
 * @example
 * ```ts
 * const resumeMetadata = await getResumeMetadata("user123");
 * console.log(resumeMetadata.fileName, resumeMetadata.url);
 * ```
 */
const getResumeMetadata = async (userId: string): Promise<Omit<ResumeMetadata, "id"> | null> => {
  const db = getFirestore();

  const resumeDocRef = db.collection(RESUMES_COLLECTION).doc(userId);

  const resumeDocSnapshot = await resumeDocRef.get();

  if (!resumeDocSnapshot.exists) {
    return null;
  }

  return resumeDocSnapshot.data() as Omit<ResumeMetadata, "id">;
};

export { getResumeMetadata };
