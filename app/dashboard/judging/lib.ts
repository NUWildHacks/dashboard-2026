"use server";

import { getFirestore } from "firebase-admin/firestore";

import { JUDGING_ASSIGNMENTS_COLLECTION, PROJECTS_COLLECTION } from "@/constants";
import { JudgeUser } from "@/types";

import { JUDGING_ASSIGNMENT_FIELDS } from "./constants";
import type { Project, ProjectWithJudgingForm } from "./types";

/**
 * Get all projects assigned to a specific judge from Firestore.
 * Queries judging assignments for the judge and returns the corresponding project documents
 * along with their associated judging forms (if any).
 *
 * @param judgeId - The judge ID to retrieve assigned projects for
 * @returns Promise resolving to an array of ProjectWithJudgingForm objects
 * @example
 * ```ts
 * const judgeId = "judge123";
 * const projects = await getAssignedProjectsWithJudgingForms(judgeId);
 * projects.forEach((project) => {
 *   console.log(`Project: ${project.name} (${project.track})`);
 *   if (project.judging_form) {
 *     console.log(`Judging form exists for ${project.name}`);
 *   }
 * });
 * ```
 */
const getAssignedProjectsWithJudgingForms = async (judgeId: JudgeUser["id"]): Promise<ProjectWithJudgingForm[]> => {
  const db = getFirestore();

  const judgingAssignmentQuerySnapshots = await db
    .collection(JUDGING_ASSIGNMENTS_COLLECTION)
    .where(JUDGING_ASSIGNMENT_FIELDS.judge_id, "==", judgeId)
    .get();

  if (judgingAssignmentQuerySnapshots.empty) return [];

  const projectIds: Project["id"][] = judgingAssignmentQuerySnapshots.docs.map((doc) => doc.data().project_id);
  const projectDocRefs = projectIds.map((projectId) => db.collection(PROJECTS_COLLECTION).doc(projectId));
  const projectDocSnapshots = await db.getAll(...projectDocRefs);

  const result = projectDocSnapshots.map((snapshot) => {
    const project = { id: snapshot.id, ...snapshot.data() } as Project;
    const judgingForm = judgingAssignmentQuerySnapshots.docs
      .find((doc) => doc.data().project_id === project.id)
      ?.data().judging_form;
    return { ...project, judging_form: judgingForm } as ProjectWithJudgingForm;
  });

  return result;
};

export { getAssignedProjectsWithJudgingForms };
