"use server";

import { getFirestore } from "firebase-admin/firestore";

import {
  JUDGING_ASSIGNMENTS_COLLECTION,
  PLACEHOLDER_DOC,
  PROJECTS_COLLECTION,
  ROUND_1_COLLECTION,
  ROUND_2_COLLECTION,
  USERS_COLLECTION,
} from "@/constants";
import type { User } from "@/types";

import { ROUND_1, ROUND_2 } from "../../judging/constants";
import { JudgingAssignment, JudgingRound, Project } from "../../judging/types";

/**
 * Get all users from Firestore.
 * Retrieves all documents from the users collection and returns them as an array.
 * Returns an empty array if no users exist.
 *
 * @returns Promise resolving to an array of User objects
 * @example
 * ```ts
 * const users = await getUsers();
 * console.log(`Found ${users.length} users`);
 * users.forEach(user => {
 *   console.log(user.email, user.role);
 * });
 * ```
 */
const getUsers = async (): Promise<User[]> => {
  const db = getFirestore();

  const userDocRef = db.collection(USERS_COLLECTION);

  const userDocSnapshots = await userDocRef.get();

  // ensure that incomplete documents (e.g. new participants)
  // are not included so it doesn't break
  return userDocSnapshots.docs
    .filter((doc) => doc.data().first_name)
    .map((doc) => ({ id: doc.id, ...doc.data() }) as User);
};

/**
 * Get all judging assignments from Firestore.
 * Retrieves all documents from the judging assignments collection and returns them as an array.
 * Returns an empty array if no judging assignments exist.
 *
 * @returns Promise resolving to a map of JudgingRound to JudgingAssignment objects
 */
const getJudgingAssignmentsMap = async (): Promise<Map<JudgingRound, JudgingAssignment[]>> => {
  const db = getFirestore();

  const round1JudgingAssignmentDocRef = db
    .collection(JUDGING_ASSIGNMENTS_COLLECTION)
    .doc(PLACEHOLDER_DOC)
    .collection(ROUND_1_COLLECTION);
  const round2JudgingAssignmentDocRef = db
    .collection(JUDGING_ASSIGNMENTS_COLLECTION)
    .doc(PLACEHOLDER_DOC)
    .collection(ROUND_2_COLLECTION);

  const [round1JudgingAssignmentDocSnapshots, round2JudgingAssignmentDocSnapshots] = await Promise.all([
    round1JudgingAssignmentDocRef.get(),
    round2JudgingAssignmentDocRef.get(),
  ]);

  const judgingAssignments = new Map<JudgingRound, JudgingAssignment[]>();
  judgingAssignments.set(
    ROUND_1,
    round1JudgingAssignmentDocSnapshots.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as JudgingAssignment)
  );
  judgingAssignments.set(
    ROUND_2,
    round2JudgingAssignmentDocSnapshots.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as JudgingAssignment)
  );

  return judgingAssignments;
};

/**
 * Get all projects from Firestore.
 * Retrieves all documents from the projects collection and returns them as an array.
 * Returns an empty array if no projects exist.
 *
 * @returns Promise resolving to an array of Project objects
 * @example
 * ```ts
 * const projects = await getProjects();
 * console.log(`Found ${projects.length} projects`);
 * projects.forEach(project => {
 *   console.log(project.id, project.name, project.track);
 * });
 * ```
 */
const getProjectsMap = async (): Promise<Map<JudgingRound, Project[]>> => {
  const db = getFirestore();

  const round1ProjectDocRef = db.collection(PROJECTS_COLLECTION).doc(PLACEHOLDER_DOC).collection(ROUND_1_COLLECTION);
  const round2ProjectDocRef = db.collection(PROJECTS_COLLECTION).doc(PLACEHOLDER_DOC).collection(ROUND_2_COLLECTION);

  const [round1ProjectDocSnapshots, round2ProjectDocSnapshots] = await Promise.all([
    round1ProjectDocRef.get(),
    round2ProjectDocRef.get(),
  ]);

  const projects = new Map<JudgingRound, Project[]>();
  projects.set(
    ROUND_1,
    round1ProjectDocSnapshots.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Project)
  );
  projects.set(
    ROUND_2,
    round2ProjectDocSnapshots.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Project)
  );

  return projects;
};

export { getUsers, getJudgingAssignmentsMap, getProjectsMap };
