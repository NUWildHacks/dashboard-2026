"use server";

import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import { PROJECTS_COLLECTION, USERS_COLLECTION, LOGIN_PATH, DASHBOARD_PROJECT_PATH, PARTICIPANT } from "@/constants";
import { getConfigDocSnapshot, verifySession } from "@/lib";
import { getUserDocSnapshot } from "@/lib/user.lib";
import type { ActionResult, User, WildHacksConfig } from "@/types";

import { type CreateProjectFormSchema } from "../_schemas/create-project-form.schemas";

export type CreateProjectResult = ActionResult<CreateProjectFormSchema>;

export const createProject = async (data: CreateProjectFormSchema): Promise<CreateProjectResult> => {
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
        error: "You are not authorized to create a project",
      };
    }

    if (project_id) {
      return {
        success: false,
        error: "You already have a project",
      };
    }

    const { name, description, github_url } = data;

    // Generate a Firestore auto-ID for the invitation code
    const invitation_code = db.collection(PROJECTS_COLLECTION).doc().id;

    const projectDocRef = db.collection(PROJECTS_COLLECTION).doc();
    await projectDocRef.set({
      name,
      description,
      owner_id: userId,
      invitation_code,
      github_url: github_url || "",
      demo_url: "",
      created_at: now,
      updated_at: now,
    });

    const userDocRef = db.collection(USERS_COLLECTION).doc(userId);
    await userDocRef.update({
      project_id: projectDocRef.id,
      joined_project_at: now,
      updated_at: now,
    });

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Create project error:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
};
