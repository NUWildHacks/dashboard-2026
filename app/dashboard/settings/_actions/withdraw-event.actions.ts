"use server";

import { getFirestore, FirebaseFirestoreError } from "firebase-admin/firestore";

import {
  PROJECTS_COLLECTION,
  USERS_COLLECTION,
  DASHBOARD_SETTINGS_PATH,
  PARTICIPANT_USER_FIELDS,
  LOGIN_PATH,
} from "@/constants";
import { getAuthenticatedUser, getConfigDocSnapshot } from "@/lib";
import type { ActionResult, ParticipantUser, User, WildHacksConfig } from "@/types";

import type { Project } from "../../project/types";

export type WithdrawEventResult = ActionResult;

export const withdrawEvent = async (): Promise<WithdrawEventResult> => {
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

    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_SETTINGS_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);
    const { project_id, id: userId } = user as { project_id?: ParticipantUser["project_id"]; id: User["id"] };

    if (project_id) {
      const projectDocRef = db.collection(PROJECTS_COLLECTION).doc(project_id);

      const projectDocSnapshot = await projectDocRef.get();

      if (projectDocSnapshot.exists) {
        const { owner_id } = projectDocSnapshot.data() as Omit<Project, "id">;

        const remainingTeamMembersQuery = await db
          .collection(USERS_COLLECTION)
          .where(PARTICIPANT_USER_FIELDS.project_id, "==", project_id)
          .orderBy(PARTICIPANT_USER_FIELDS.joined_project_at, "asc")
          .get();

        const otherMembers = remainingTeamMembersQuery.docs.filter((doc) => doc.id !== userId);

        if (otherMembers.length === 0) {
          await projectDocRef.delete();
        } else if (owner_id === userId) {
          const newOwnerId = otherMembers[0]?.id;

          if (newOwnerId) {
            await projectDocRef.update({
              owner_id: newOwnerId,
              updated_at: now,
            });
          }
        }
      }
    }

    await db.collection(USERS_COLLECTION).doc(userId).delete();

    return { success: true };
  } catch (error) {
    let errorMessage;
    if (error instanceof FirebaseFirestoreError || error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "An unknown error occurred";
    }

    console.error("Withdraw event error:", errorMessage);

    return { success: false, error: errorMessage };
  }
};
