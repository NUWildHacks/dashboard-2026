"use server";

import { getFirestore } from "firebase-admin/firestore";

import { PROJECTS_COLLECTION } from "@/constants/db.constants";
import User from "@/types/user.types";

/**
 * Get a project document snapshot from Firestore.
 * Returns undefined if no project ID is provided.
 *
 * @param projectId - The project ID to retrieve, or undefined/null
 * @returns Promise resolving to the Firestore document snapshot if projectId exists, undefined otherwise
 * @example
 * ```ts
 * const user = await getUserDocSnapshot(userId);
 * const projectId = user.data()?.project_id;
 * const projectSnapshot = await getProjectDocSnapshot(projectId);
 * if (projectSnapshot?.exists) {
 *   const projectData = projectSnapshot.data();
 *   console.log(projectData.name);
 * }
 * ```
 */
const getProjectDocSnapshot = async (projectId: User["project_id"]) => {
  if (!projectId) return;

  const db = getFirestore();

  const projectDocRef = db.collection(PROJECTS_COLLECTION).doc(projectId);

  const projectDocSnapshot = await projectDocRef.get();

  return projectDocSnapshot;
};

export { getProjectDocSnapshot };
