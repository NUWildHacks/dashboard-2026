"use server";

import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

import {
  CROWD_FAVORITES_COLLECTION,
  DASHBOARD_CROWD_FAVORITE_PATH,
  DASHBOARD_PATH,
  LOGIN_PATH,
  PARTICIPANT,
  USERS_COLLECTION,
} from "@/constants";
import { getAuthenticatedUser, requireRole, getConfigDocSnapshot } from "@/lib";
import type { ActionResult, CrowdFavoriteProject, ParticipantUser, WildHacksConfig } from "@/types";

import { isCrowdFavoriteOptInOpen } from "../constants";

type CrowdFavoriteOptOutResult = ActionResult;

const optOutOfCrowdFavorite = async (): Promise<CrowdFavoriteOptOutResult> => {
  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_CROWD_FAVORITE_PATH)}`;
    const caller = await getAuthenticatedUser(redirectPath);

    const roleCheck = requireRole(caller, PARTICIPANT);
    if (roleCheck) return roleCheck;

    const participantCaller = caller as ParticipantUser;

    // Fetch config once to pass to all helpers
    const configDocSnapshot = await getConfigDocSnapshot();
    const config = configDocSnapshot.data() as WildHacksConfig;

    if (!(await isCrowdFavoriteOptInOpen(config))) {
      return { success: false, error: "Crowd favorite opt-out is currently closed" };
    }

    const crowdFavoriteProjectId = participantCaller.crowd_favorite_project_id;
    if (!crowdFavoriteProjectId) {
      return { success: false, error: "You are not assigned to a crowd favorite project" };
    }

    const db = getFirestore();
    const now = Date.now();

    await db.runTransaction(async (transaction) => {
      const callerRef = db.collection(USERS_COLLECTION).doc(caller.id);
      const callerSnapshot = await transaction.get(callerRef);

      if (!callerSnapshot.exists) {
        throw new Error("Authenticated user no longer exists");
      }

      const callerData = callerSnapshot.data() as Omit<ParticipantUser, "id">;
      const currentProjectId = callerData.crowd_favorite_project_id;

      if (!currentProjectId) {
        throw new Error("You are no longer assigned to a crowd favorite project");
      }

      const currentProjectRef = db.collection(CROWD_FAVORITES_COLLECTION).doc(currentProjectId);
      const projectSnapshot = await transaction.get(currentProjectRef);

      if (!projectSnapshot.exists) {
        throw new Error("Crowd favorite project not found");
      }

      const project = {
        id: projectSnapshot.id,
        ...(projectSnapshot.data() as Omit<CrowdFavoriteProject, "id">),
      };

      const callerIsMember = project.team_members.some((member) => member.id === caller.id);
      if (!callerIsMember) {
        throw new Error("You are not on this crowd favorite team");
      }

      const memberIds = [...new Set(project.team_members.map((member) => member.id))];

      const memberRefs = memberIds.map((memberId) => db.collection(USERS_COLLECTION).doc(memberId));
      const memberSnapshots = await Promise.all(memberRefs.map((memberRef) => transaction.get(memberRef)));

      memberSnapshots.forEach((memberSnapshot, index) => {
        if (!memberSnapshot.exists) return;

        const memberData = memberSnapshot.data() as Omit<ParticipantUser, "id">;
        if (memberData.crowd_favorite_project_id !== project.id) return;

        transaction.update(memberRefs[index], {
          crowd_favorite_project_id: FieldValue.delete(),
          updated_at: now,
        });
      });

      // We remove the project document as a whole on opt-out so the team is no longer votable.
      transaction.delete(currentProjectRef);
    });

    revalidatePath(DASHBOARD_CROWD_FAVORITE_PATH);
    revalidatePath(DASHBOARD_PATH);

    return { success: true };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Crowd favorite opt-out error:", detailedError);

    const isProduction = process.env.APP_ENV === "production";
    const errorMessage = isProduction ? "An unknown error occurred. Please try again." : detailedError;

    return { success: false, error: errorMessage };
  }
};

export { optOutOfCrowdFavorite };
export type { CrowdFavoriteOptOutResult };
