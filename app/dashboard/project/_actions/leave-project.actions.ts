"use server";

import { getFirestore, FieldValue, FirebaseFirestoreError } from "firebase-admin/firestore";

import {
  PROJECTS_COLLECTION,
  USERS_COLLECTION,
  DASHBOARD_PROJECT_PATH,
  PARTICIPANT_USER_FIELDS,
  PARTICIPANT,
  LOGIN_PATH,
} from "@/constants";
import { getAuthenticatedUser, getConfigDocSnapshot, requireRole } from "@/lib";
import type { ActionResult, ParticipantUser, WildHacksConfig } from "@/types";

import type { Project } from "../types";

export type LeaveProjectResult = ActionResult;

export const leaveProject = async (projectId: Project["id"]): Promise<LeaveProjectResult> => {
  const db = getFirestore();
  const now = Date.now();

  try {
    const configDocSnapshot = await getConfigDocSnapshot();
    const { end_time } = configDocSnapshot.data() as WildHacksConfig;

    if (now >= end_time) {
      return {
        success: false,
        error: "The event has ended",
      };
    }

    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PROJECT_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);

    const roleError = requireRole(user, PARTICIPANT, "You are not authorized to leave this project");
    if (roleError) return roleError;

    const { project_id, id: userId } = user as ParticipantUser;

    if (!project_id || project_id !== projectId) {
      return {
        success: false,
        error: "You are not a member of this project",
      };
    }

    await db.collection(USERS_COLLECTION).doc(userId).update({
      project_id: FieldValue.delete(),
      joined_project_at: FieldValue.delete(),
      updated_at: now,
    });

    const projectDocRef = db.collection(PROJECTS_COLLECTION).doc(projectId);
    const projectDocSnapshot = await projectDocRef.get();

    if (projectDocSnapshot.exists) {
      const { owner_id } = projectDocSnapshot.data() as Omit<Project, "id">;

      const remainingTeamMembersQuery = await db
        .collection(USERS_COLLECTION)
        .where(PARTICIPANT_USER_FIELDS.project_id, "==", projectId)
        .orderBy(PARTICIPANT_USER_FIELDS.joined_project_at, "asc")
        .get();

      if (remainingTeamMembersQuery.empty) {
        await projectDocRef.delete();
      } else if (owner_id === userId) {
        const newOwnerId = remainingTeamMembersQuery.docs[0].id;

        await projectDocRef.update({
          owner_id: newOwnerId,
          updated_at: now,
        });
      }
    }

    return { success: true };
  } catch (error) {
    let errorMessage;
    if (error instanceof FirebaseFirestoreError || error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "An unknown error occurred";
    }

    console.error("Leave project error:", errorMessage);

    return { success: false, error: errorMessage };
  }
};
