"use server";

import { getFirestore } from "firebase-admin/firestore";

import {
  JUDGING_ASSIGNMENTS_COLLECTION,
  PLACEHOLDER_DOC,
  PROJECTS_COLLECTION,
  ROUND_1_COLLECTION,
  ROUND_2_COLLECTION,
} from "@/constants";
import { JudgeUser } from "@/types";

import { JUDGING_ASSIGNMENT_FIELDS, ROUND_1 } from "./constants";
import type { JudgingAssignment, JudgingAssignmentWithProject, JudgingRound, Project } from "./types";

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
  judgingRound: JudgingRound
): Promise<JudgingAssignmentWithProject[]> => {
  const db = getFirestore();

  let query = db
    .collection(JUDGING_ASSIGNMENTS_COLLECTION)
    .doc(PLACEHOLDER_DOC)
    .collection(judgingRound === ROUND_1 ? ROUND_1_COLLECTION : ROUND_2_COLLECTION)
    .where(JUDGING_ASSIGNMENT_FIELDS.judge_id, "==", judgeId)
    .where(JUDGING_ASSIGNMENT_FIELDS.judging_round, "==", judgingRound);

  if (judgingRound !== ROUND_1) {
    query = query.orderBy(JUDGING_ASSIGNMENT_FIELDS.order, "asc");
  }

  const judgingAssignmentQuerySnapshots = await query.get();

  if (judgingAssignmentQuerySnapshots.empty) return [];

  const projectIds = new Set<Project["id"]>();
  judgingAssignmentQuerySnapshots.docs.forEach((doc) => {
    projectIds.add(doc.data().project_id);
  });

  const projectDocRefs = Array.from(projectIds).map((projectId) =>
    db
      .collection(PROJECTS_COLLECTION)
      .doc(PLACEHOLDER_DOC)
      .collection(judgingRound === ROUND_1 ? ROUND_1_COLLECTION : ROUND_2_COLLECTION)
      .doc(projectId)
  );
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
