"use server";

import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import { PROJECTS_COLLECTION, USERS_COLLECTION, LOGIN_PATH, DASHBOARD_SETTINGS_PATH, USER_FIELDS } from "@/constants";
import { verifySession } from "@/lib";
import { getUserDocSnapshot } from "@/lib/user.lib";

export type WithdrawEventResult = { success: true } | { success: false; error: string };

export const withdrawEvent = async (): Promise<WithdrawEventResult> => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_SETTINGS_PATH)}`);

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

    if (project_id) {
      const projectDocRef = db.collection(PROJECTS_COLLECTION).doc(project_id);
      const projectDocSnapshot = await projectDocRef.get();

      if (!projectDocSnapshot.exists) {
        return {
          success: false,
          error: "Project not found",
        };
      }

      const projectData = projectDocSnapshot.data();
      const isOwner = projectData?.owner_id === userId;

      const remainingTeamMembersQuery = await db
        .collection(USERS_COLLECTION)
        .where(USER_FIELDS.project_id, "==", project_id)
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
    }

    const userDocRef = db.collection(USERS_COLLECTION).doc(userId);
    await userDocRef.delete();

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Withdraw event error:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
};
