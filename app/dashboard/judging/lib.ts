"use server";

import { getFirestore } from "firebase-admin/firestore";

import { JUDGING_ASSIGNMENTS_COLLECTION, PROJECTS_COLLECTION } from "@/constants";
import { JudgeUser } from "@/types";

import { JUDGING_ASSIGNMENT_FIELDS } from "./constants";
import type { Project, ProjectWithMetadata } from "./types";

/**
 * Retrieves projects with their judging metadata from Firestore.
 *
 * Fetches project documents based on judging assignments. When a judge ID is provided,
 * only returns projects assigned to that judge. When omitted, returns all projects
 * that have judging assignments. Each project includes its associated judging form
 * data if available.
 *
 * @param judgeId - Optional judge ID to filter by. If provided, only returns projects
 *   assigned to this judge. If omitted, returns all projects with judging assignments.
 * @returns Promise that resolves to an array of ProjectWithMetadata objects, each
 *   containing project data and its associated judging form (if any)
 * @example
 * ```ts
 * // Get projects for a specific judge
 * const projects = await getProjectsWithMetadata("judge123");
 *
 * // Get all projects with judging assignments
 * const allProjects = await getProjectsWithMetadata();
 * ```
 */
const getProjectsWithMetadata = async (judgeId?: JudgeUser["id"]): Promise<ProjectWithMetadata[]> => {
  const db = getFirestore();

  const judgingAssignmentQuerySnapshots = judgeId
    ? await db.collection(JUDGING_ASSIGNMENTS_COLLECTION).where(JUDGING_ASSIGNMENT_FIELDS.judge_id, "==", judgeId).get()
    : await db.collection(JUDGING_ASSIGNMENTS_COLLECTION).get();

  if (judgingAssignmentQuerySnapshots.empty) return [];

  const projectIds = new Set<Project["id"]>();
  judgingAssignmentQuerySnapshots.docs.forEach((doc) => {
    projectIds.add(doc.data().project_id);
  });
  const projectDocRefs = Array.from(projectIds).map((projectId) => db.collection(PROJECTS_COLLECTION).doc(projectId));
  const projectDocSnapshots = await db.getAll(...projectDocRefs);

  const result = projectDocSnapshots.map((snapshot) => {
    const project = { id: snapshot.id, ...snapshot.data() } as Project;
    const judgingForm = judgingAssignmentQuerySnapshots.docs
      .find((doc) => doc.data().project_id === project.id)
      ?.data().judging_form;
    return { ...project, judging_form: judgingForm } as ProjectWithMetadata;
  });

  return result;
};

export { getProjectsWithMetadata };
