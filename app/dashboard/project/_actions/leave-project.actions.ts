"use server";

import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import { PROJECTS_COLLECTION, USERS_COLLECTION, LOGIN_PATH, DASHBOARD_PROJECT_PATH, USER_FIELDS } from "@/constants";
import { verifySession } from "@/lib";
import { getUserDocSnapshot } from "@/lib/user.lib";

export type LeaveProjectResult = { success: true } | { success: false; error: string };

export const leaveProject = async (projectId: string): Promise<LeaveProjectResult> => {
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
        error: "You are not a member of this project",
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

    const projectData = projectDocSnapshot.data();
    const isOwner = projectData?.owner_id === userId;

    const userDocRef = db.collection(USERS_COLLECTION).doc(userId);

    await userDocRef.update({
      project_id: FieldValue.delete(),
      joined_project_at: FieldValue.delete(),
      updated_at: now,
    });

    const remainingTeamMembersQuery = await db
      .collection(USERS_COLLECTION)
      .where(USER_FIELDS.project_id, "==", projectId)
      .orderBy(USER_FIELDS.joined_project_at, "asc")
      .get();

    if (remainingTeamMembersQuery.empty) {
      await projectDocRef.delete();
    } else if (isOwner) {
      const newOwnerId = remainingTeamMembersQuery.docs[0].id;

      await projectDocRef.update({
        owner_id: newOwnerId,
        updated_at: now,
      });
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Leave project error:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
};
