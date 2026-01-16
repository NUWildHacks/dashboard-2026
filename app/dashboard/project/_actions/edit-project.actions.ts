"use server";

import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import { PROJECTS_COLLECTION, LOGIN_PATH, DASHBOARD_PROJECT_PATH } from "@/constants";
import { verifySession } from "@/lib";
import { getUserDocSnapshot } from "@/lib/user.lib";

import { type EditProjectFormSchema } from "../_schemas/edit-project-form.schemas";

export type EditProjectResult =
  | { success: true }
  | { success: false; error: string; field?: keyof EditProjectFormSchema };

export const editProject = async (projectId: string, data: EditProjectFormSchema): Promise<EditProjectResult> => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PROJECT_PATH)}`);

  const db = getFirestore();
  const now = Date.now();

  try {
    const userDocSnapshot = await getUserDocSnapshot(userId);
    if (!userDocSnapshot.exists) {
      return {
        success: false,
        error: "User document not found",
      };
    }

    const userData = userDocSnapshot.data();
    const { project_id } = userData as { project_id?: string };

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
