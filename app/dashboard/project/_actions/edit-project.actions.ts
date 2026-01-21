"use server";

import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import { PROJECTS_COLLECTION, LOGIN_PATH, DASHBOARD_PROJECT_PATH, PARTICIPANT } from "@/constants";
import { getConfigDocSnapshot, verifySession } from "@/lib";
import { getUserDocSnapshot } from "@/lib/user.lib";
import type { ActionResult, User, WildHacksConfig } from "@/types";

import { type EditProjectFormSchema } from "../_schemas/edit-project-form.schemas";

export type EditProjectResult = ActionResult<EditProjectFormSchema>;

export const editProject = async (projectId: string, data: EditProjectFormSchema): Promise<EditProjectResult> => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PROJECT_PATH)}`);

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

    const userDocSnapshot = await getUserDocSnapshot(userId);
    if (!userDocSnapshot.exists) {
      return {
        success: false,
        error: "User document not found",
      };
    }

    const { project_id, role } = userDocSnapshot.data() as Omit<User, "id">;

    if (role !== PARTICIPANT) {
      return {
        success: false,
        error: "You are not authorized to edit this project",
      };
    }

    if (!project_id || project_id !== projectId) {
      return {
        success: false,
        error: "You do not have permission to edit this project",
      };
    }

    const projectDocRef = db.collection(PROJECTS_COLLECTION).doc(projectId);
    const projectDocSnapshot = await projectDocRef.get();
    if (!projectDocSnapshot.exists) {
      return {
        success: false,
        error: "Project not found",
      };
    }

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
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Edit project error:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
};
