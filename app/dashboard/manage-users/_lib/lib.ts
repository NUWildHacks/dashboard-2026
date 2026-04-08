"use server";

import { getFirestore } from "firebase-admin/firestore";

import { JUDGING_ASSIGNMENTS_COLLECTION, PROJECTS_COLLECTION, USERS_COLLECTION } from "@/constants";
import type { User } from "@/types";

import { JudgingAssignment, Project } from "../../judging/types";

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
 * @returns Promise resolving to an array of JudgingAssignment objects
 * @example
 * ```ts
 * const assignments = await getJudgingAssignments();
 * console.log(`Found ${assignments.length} judging assignments`);
 * assignments.forEach(assignment => {
 *   console.log(assignment.id, assignment.judge_id, assignment.project_id);
 * });
 * ```
 */
const getJudgingAssignments = async (): Promise<JudgingAssignment[]> => {
  const db = getFirestore();

  const judgingAssignmentDocRef = db.collection(JUDGING_ASSIGNMENTS_COLLECTION);

  const judgingAssignmentDocSnapshots = await judgingAssignmentDocRef.get();

  return judgingAssignmentDocSnapshots.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as JudgingAssignment);
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
const getProjects = async (): Promise<Project[]> => {
  const db = getFirestore();

  const projectDocRef = db.collection(PROJECTS_COLLECTION);

  const projectDocSnapshots = await projectDocRef.get();

  return projectDocSnapshots.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Project);
};

export { getUsers, getJudgingAssignments, getProjects };
