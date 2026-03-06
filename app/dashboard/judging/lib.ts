"use server";

import { getFirestore } from "firebase-admin/firestore";

import { PROJECTS_COLLECTION } from "@/constants";

import type { Project } from "./types";

/**
 * Get a project document from Firestore by project ID.
 * Returns null if no project ID is provided or if the project document doesn't exist.
 *
 * @param projectId - The project ID to retrieve, or undefined/null
 * @returns Promise resolving to the Project object if found, null otherwise
 * @example
 * ```ts
 * const user = await getAuthenticatedUser();
 * const projectId = user.project_id;
 * const project = await getProject(projectId);
 * if (project) {
 *   console.log(project.name, project.description);
 * } else {
 *   console.log("No project found");
 * }
 * ```
 */
const getProject = async (projectId: Project["id"]) => {
  const db = getFirestore();

  const projectDocSnapshot = await db.collection(PROJECTS_COLLECTION).doc(projectId).get();
  if (!projectDocSnapshot.exists) return null;

  return { ...projectDocSnapshot.data(), id: projectId } as Project;
};

export { getProject };
