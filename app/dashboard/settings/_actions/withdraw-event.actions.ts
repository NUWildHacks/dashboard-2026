"use server";

import { getFirestore } from "firebase-admin/firestore";

import { PROJECTS_COLLECTION, USERS_COLLECTION, DASHBOARD_SETTINGS_PATH, PARTICIPANT_USER_FIELDS } from "@/constants";
import { getAuthenticatedUser, getConfigDocSnapshot } from "@/lib";
import type { ActionResult, ParticipantUser, User, WildHacksConfig } from "@/types";

export type WithdrawEventResult = ActionResult;

export const withdrawEvent = async (): Promise<WithdrawEventResult> => {
  const db = getFirestore();
  const now = Date.now();

  try {
    const user = await getAuthenticatedUser(DASHBOARD_SETTINGS_PATH);
    const { project_id, id: userId } = user as { project_id?: ParticipantUser["project_id"]; id: User["id"] };

    const configDocSnapshot = await getConfigDocSnapshot();
    const { end_time } = configDocSnapshot.data() as WildHacksConfig;

    if (now >= end_time) {
      return {
        success: false,
        error: "The event has ended",
      };
    }

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
        .where(PARTICIPANT_USER_FIELDS.project_id, "==", project_id)
        .orderBy(PARTICIPANT_USER_FIELDS.joined_project_at, "asc")
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

    await db.collection(USERS_COLLECTION).doc(userId).delete();

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
