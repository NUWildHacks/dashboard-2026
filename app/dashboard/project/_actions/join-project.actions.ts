"use server";

import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import { PROJECTS_COLLECTION, USERS_COLLECTION, LOGIN_PATH, DASHBOARD_PROJECT_PATH } from "@/constants";
import { getConfigDocSnapshot, verifySession } from "@/lib";
import type { ActionResult, WildHacksConfig } from "@/types";

import { PROJECT_FIELDS } from "../_constants";
import { type JoinProjectFormSchema } from "../_schemas/join-project-form.schemas";

export type JoinProjectResult = ActionResult<JoinProjectFormSchema>;

export const joinProject = async (data: JoinProjectFormSchema): Promise<JoinProjectResult> => {
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

    const { invitation_code } = data;

    const userDocRef = db.collection(USERS_COLLECTION).doc(userId);
    const userDocSnapshot = await userDocRef.get();

    if (!userDocSnapshot.exists) {
      return {
        success: false,
        error: "User document not found",
        field: "invitation_code",
      };
    }

    const userData = userDocSnapshot.data();
    const { project_id } = userData as { project_id?: string };

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

    await userDocRef.update({
      project_id: projectId,
      joined_project_at: now,
      updated_at: now,
    });

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Join project error:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
};
