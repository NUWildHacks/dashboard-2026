"use server";

import { getFirestore } from "firebase-admin/firestore";
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
import type { ActionResult, CrowdFavoriteProject, WildHacksConfig } from "@/types";

import { getCrowdFavoriteProjectForUser } from "../_lib";

import { isCrowdFavoriteOptInOpen } from "../constants";

type CrowdFavoriteOptOutResult = ActionResult;

const optOutOfCrowdFavorite = async (): Promise<CrowdFavoriteOptOutResult> => {
  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_CROWD_FAVORITE_PATH)}`;
    const caller = await getAuthenticatedUser(redirectPath);

    const roleCheck = requireRole(caller, PARTICIPANT);
    if (roleCheck) return roleCheck;

    // Fetch config once to pass to all helpers
    const configDocSnapshot = await getConfigDocSnapshot();
    const config = configDocSnapshot.data() as WildHacksConfig;

    if (!(await isCrowdFavoriteOptInOpen(config))) {
      return { success: false, error: "Crowd favorite opt-out is currently closed" };
    }

    const db = getFirestore();

    const crowdFavoriteProject = await getCrowdFavoriteProjectForUser(caller.id);
    if (!crowdFavoriteProject) {
      return { success: false, error: "You are not assigned to a crowd favorite project" };
    }

    await db.runTransaction(async (transaction) => {
      const currentProjectRef = db.collection(CROWD_FAVORITES_COLLECTION).doc(crowdFavoriteProject.id);
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
