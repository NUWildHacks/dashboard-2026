"use server";

import { getFirestore } from "firebase-admin/firestore";

import { JUDGING_ASSIGNMENTS_COLLECTION, PROJECTS_COLLECTION } from "@/constants";
import { JudgeUser } from "@/types";

import { JUDGING_ASSIGNMENT_FIELDS } from "./constants";
import type { JudgingAssignment, JudgingAssignmentWithProject, Project } from "./types";

/**
 * Retrieves judging assignments with their projects from Firestore.
 *
 * Fetches project documents based on judging assignments. When a judge ID and round are provided,
 * only returns judging assignments with their projects assigned to that judge for that round. Each judging assignment includes its associated
 * project and judging form data if available.
 *
 * @param judgeId - Judge ID to filter by.
 * @param round - The judging round to get projects for. 1 for round 1, 2 for round 2.
 * @returns Promise that resolves to an array of JudgingAssignmentWithProject objects, each
 *   containing project data and its associated judging form (if any)
 * @example
 * ```ts
 * // Get judging assignments with their projects for a specific judge
 * const round1Projects = await getJudgingAssignmentsWithProjectForRound("judge123", 1);
 * const round2Projects = await getJudgingAssignmentsWithProjectForRound("judge123", 2);
 * ```
 */
const getJudgingAssignmentsWithProjectForRound = async (
  judgeId: JudgeUser["id"],
  round: 1 | 2
): Promise<JudgingAssignmentWithProject[]> => {
  const db = getFirestore();

  // round 1: all projects assigned to the judge with order 0
  // round 2: all projects assigned to the judge ordered by order
  const judgingAssignmentQuerySnapshots =
    round === 1
      ? await db
          .collection(JUDGING_ASSIGNMENTS_COLLECTION)
          .where(JUDGING_ASSIGNMENT_FIELDS.judge_id, "==", judgeId)
          .where(JUDGING_ASSIGNMENT_FIELDS.order, "==", 0)
          .get()
      : await db
          .collection(JUDGING_ASSIGNMENTS_COLLECTION)
          .where(JUDGING_ASSIGNMENT_FIELDS.judge_id, "==", judgeId)
          .where(JUDGING_ASSIGNMENT_FIELDS.order, ">=", 0)
          .orderBy(JUDGING_ASSIGNMENT_FIELDS.order, "asc")
          .get();

  if (judgingAssignmentQuerySnapshots.empty) return [];

  const projectIds = new Set<Project["id"]>();
  judgingAssignmentQuerySnapshots.docs.forEach((doc) => {
    projectIds.add(doc.data().project_id);
  });

  const projectDocRefs = Array.from(projectIds).map((projectId) => db.collection(PROJECTS_COLLECTION).doc(projectId));
  const projectDocs = await db.getAll(...projectDocRefs);

  const projectMap = new Map<Project["id"], Project>();
  projectDocs.forEach((doc) => {
    projectMap.set(doc.id, { id: doc.id, ...doc.data() } as Project);
  });

  const result: JudgingAssignmentWithProject[] = judgingAssignmentQuerySnapshots.docs.map((doc) => {
    const project = projectMap.get(doc.data().project_id);
    return { ...(doc.data() as Omit<JudgingAssignment, "id">), id: doc.id, project } as JudgingAssignmentWithProject;
  });

  return result;
};

export { getJudgingAssignmentsWithProjectForRound };
