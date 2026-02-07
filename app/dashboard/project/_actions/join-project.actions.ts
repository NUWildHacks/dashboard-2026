"use server";

import { getFirestore } from "firebase-admin/firestore";

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

import { type JoinProjectFormSchema } from "../_schemas/join-project-form.schemas";
import { PROJECT_FIELDS } from "../constants";

export type JoinProjectResult = ActionResult<JoinProjectFormSchema>;

export const joinProject = async (data: JoinProjectFormSchema): Promise<JoinProjectResult> => {
  const db = getFirestore();
  const now = Date.now();

  try {
    const configDocSnapshot = await getConfigDocSnapshot();
    const { end_time, max_team_size } = configDocSnapshot.data() as WildHacksConfig;

    if (now >= end_time) {
      return {
        success: false,
        error: "The event has ended",
      };
    }

    const { invitation_code } = data;

    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PROJECT_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);

    const roleError = requireRole(user, PARTICIPANT, "You are not authorized to join a project");
    if (roleError) return roleError;

    const { project_id, id: userId } = user as ParticipantUser;

    if (project_id) {
      return {
        success: false,
        error: "You already have a project",
        field: "invitation_code",
      };
    }

    const projectQuerySnapshot = await db
      .collection(PROJECTS_COLLECTION)
      .where(PROJECT_FIELDS.invitation_code, "==", invitation_code)
      .limit(1)
      .get();

    if (projectQuerySnapshot.empty) {
      return {
        success: false,
        error: "Invalid invitation code",
        field: "invitation_code",
      };
    }

    const projectId = projectQuerySnapshot.docs[0].id;

    const teamMembersDocRefs = db
      .collection(USERS_COLLECTION)
      .where(PARTICIPANT_USER_FIELDS.project_id, "==", projectId);
    const teamMembersDocSnapshots = await teamMembersDocRefs.get();
    if (teamMembersDocSnapshots.docs.length >= max_team_size) {
      return {
        success: false,
        error: "Project is full",
        field: "invitation_code",
      };
    }

    const userDocRef = db.collection(USERS_COLLECTION).doc(userId);
    await userDocRef.update({
      project_id: projectId,
      joined_project_at: now,
      updated_at: now,
    });

    return { success: true };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Join project error:", detailedError);

    const isProduction = process.env.APP_ENV === "production";
    const errorMessage = isProduction ? "An unknown error occurred. Please try again." : detailedError;

    return { success: false, error: errorMessage };
  }
};
