"use server";

import { getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

import {
  ADMIN,
  DASHBOARD_MANAGE_USERS_PATH,
  JUDGING_ASSIGNMENTS_COLLECTION,
  LOGIN_PATH,
  PLACEHOLDER_DOC,
  PROJECTS_COLLECTION,
  ROUND_1_COLLECTION,
  ROUND_2_COLLECTION,
} from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import { ActionResult } from "@/types";

import { JudgingAssignmentsCsvArraySchema } from "../_schemas";
import { ROUND_1 } from "../../judging/constants";
import { JudgingAssignment, JudgingRound, Project } from "../../judging/types";

export type UploadAssignmentsResult = ActionResult<JudgingAssignmentsCsvArraySchema>;

export const uploadAssignments = async (
  data: JudgingAssignmentsCsvArraySchema,
  uploadRound: JudgingRound
): Promise<UploadAssignmentsResult> => {
  const db = getFirestore();

  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_MANAGE_USERS_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);

    const roleError = requireRole(user, ADMIN, "You are not authorized to upload judging assignments");
    if (roleError) return roleError;

    const projectsCollectionRef = db
      .collection(PROJECTS_COLLECTION)
      .doc(PLACEHOLDER_DOC)
      .collection(uploadRound === ROUND_1 ? ROUND_1_COLLECTION : ROUND_2_COLLECTION);
    const judgingAssignmentsCollectionRef = db
      .collection(JUDGING_ASSIGNMENTS_COLLECTION)
      .doc(PLACEHOLDER_DOC)
      .collection(uploadRound === ROUND_1 ? ROUND_1_COLLECTION : ROUND_2_COLLECTION);

    await Promise.all([db.recursiveDelete(projectsCollectionRef), db.recursiveDelete(judgingAssignmentsCollectionRef)]);

    const judgingAssignmentBatch = db.batch();
    const projectBatch = db.batch();

    const seenProjectIds = new Set<Project["id"]>();

    for (const assignment of data) {
      const { room_id, ...rest } = assignment;
      const { project_id, project_name, track, devpost_url } = rest;

      if (!seenProjectIds.has(project_id)) {
        seenProjectIds.add(project_id);

        const projectDocRef = projectsCollectionRef.doc(project_id);
        projectBatch.set(projectDocRef, {
          name: project_name,
          track,
          devpost_url,
        } as Omit<Project, "id">);
      }

      const assignmentData: Omit<JudgingAssignment, "id"> = room_id
        ? {
            ...rest,
            room_id,
          }
        : rest;

      const assignmentDocRef = judgingAssignmentsCollectionRef.doc();
      judgingAssignmentBatch.set(assignmentDocRef, assignmentData);
    }

    await Promise.all([judgingAssignmentBatch.commit(), projectBatch.commit()]);

    revalidatePath(DASHBOARD_MANAGE_USERS_PATH);

    return { success: true };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Upload assignments error:", detailedError);

    const isProduction = process.env.APP_ENV === "production";
    const errorMessage = isProduction ? "An unknown error occurred. Please try again." : detailedError;

    return { success: false, error: errorMessage };
  }
};
