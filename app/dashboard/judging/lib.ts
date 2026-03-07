"use server";

import { getFirestore } from "firebase-admin/firestore";

import { JUDGING_ASSIGNMENTS_COLLECTION, PROJECTS_COLLECTION } from "@/constants";
import { JudgeUser } from "@/types";

import { JUDGING_ASSIGNMENT_FIELDS } from "./constants";
import type { Project } from "./types";

/**
 * Get all projects assigned to a specific judge from Firestore.
 * Queries judging assignments for the judge and returns the corresponding project documents.
 *
 * @param judgeId - The judge ID to retrieve assigned projects for
 * @returns Promise resolving to an array of Project objects
 * @example
 * ```ts
 * const judgeId = "judge123";
 * const projects = await getAssignedProjects(judgeId);
 * projects.forEach((project) => {
 *   console.log(`Project: ${project.name} (${project.track})`);
 * });
 * ```
 */
const getAssignedProjects = async (judgeId: JudgeUser["id"]) => {
  const db = getFirestore();

  const judgingAssignmentDocSnapshots = await db.collection(JUDGING_ASSIGNMENTS_COLLECTION).where(JUDGING_ASSIGNMENT_FIELDS.judge_id, "==", judgeId).get();
  const projectIds: Project["id"][] = judgingAssignmentDocSnapshots.docs.map((doc) => doc.data().project_id);

  if (projectIds.length === 0) return [];

  const projectDocRefs = projectIds.map((projectId) => db.collection(PROJECTS_COLLECTION).doc(projectId));
  const projectDocSnapshots = await db.getAll(...projectDocRefs);

  const assignedProjects = projectDocSnapshots.map((snapshot) => {
    return { id: snapshot.id, ...snapshot.data() } as Project;
  });

  return assignedProjects;
};

export { getAssignedProjects };
