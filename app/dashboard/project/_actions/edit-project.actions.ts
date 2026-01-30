"use server";

import { getFirestore, FirebaseFirestoreError } from "firebase-admin/firestore";

import { PROJECTS_COLLECTION, DASHBOARD_PROJECT_PATH, PARTICIPANT } from "@/constants";
import { getAuthenticatedUser, getConfigDocSnapshot, requireRole } from "@/lib";
import type { ActionResult, ParticipantUser, WildHacksConfig } from "@/types";

import { type EditProjectFormSchema } from "../_schemas/edit-project-form.schemas";
import type { Project } from "../types";

export type EditProjectResult = ActionResult<EditProjectFormSchema>;

export const editProject = async (
  projectId: Project["id"],
  data: EditProjectFormSchema
): Promise<EditProjectResult> => {
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

    const user = await getAuthenticatedUser(`${DASHBOARD_PROJECT_PATH}`);
    const roleError = requireRole(user, PARTICIPANT, "You are not authorized to edit this project");
    if (roleError) return roleError;

    const { project_id } = user as ParticipantUser;

    if (!project_id || project_id !== projectId) {
      return {
        success: false,
        error: "You do not have permission to edit this project",
      };
    }

    const projectDocRef = db.collection(PROJECTS_COLLECTION).doc(projectId);
    const { name, description, github_url, demo_url } = data;

    await projectDocRef.update({
      name,
      description,
      github_url: github_url || "",
      demo_url: demo_url || "",
      updated_at: now,
    });

    return { success: true };
  } catch (error) {
    let errorMessage;
    if (error instanceof FirebaseFirestoreError || error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "An unknown error occurred";
    }

    console.error("Edit project error:", errorMessage);

    return { success: false, error: errorMessage };
  }
};
