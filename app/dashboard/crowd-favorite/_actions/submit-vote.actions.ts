"use server";

import { getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

import {
  CROWD_FAVORITES_COLLECTION,
  CROWD_FAVORITE_VOTES_SUBCOLLECTION,
  DASHBOARD_CROWD_FAVORITE_PATH,
  DASHBOARD_PATH,
  LOGIN_PATH,
  PARTICIPANT,
} from "@/constants";
import { getAuthenticatedUser, getConfigDocSnapshot, requireRole } from "@/lib";
import type { ActionResult, Vote, WildHacksConfig } from "@/types";

import { getUserVotedProjectId } from "../_lib";
import { crowdFavoriteVoteFormSchema, type CrowdFavoriteVoteFormSchema } from "../_schemas/vote-form.schemas";
import { isCrowdFavoriteVotingOpen } from "../constants";

type SubmitCrowdFavoriteVoteResult = ActionResult<CrowdFavoriteVoteFormSchema>;

const submitCrowdFavoriteVote = async (
  rawData: CrowdFavoriteVoteFormSchema
): Promise<SubmitCrowdFavoriteVoteResult> => {
  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_CROWD_FAVORITE_PATH)}`;
    const caller = await getAuthenticatedUser(redirectPath);

    const roleCheck = requireRole(caller, PARTICIPANT);
    if (roleCheck) return roleCheck;

    const configDocSnapshot = await getConfigDocSnapshot();
    const config = configDocSnapshot.data() as WildHacksConfig;

    if (!(await isCrowdFavoriteVotingOpen(config))) {
      return { success: false, error: "Voting is not open right now" };
    }

    const parsed = crowdFavoriteVoteFormSchema.safeParse(rawData);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      const firstField = firstIssue.path[0];

      return {
        success: false,
        error: firstIssue.message,
        field: typeof firstField === "string" ? (firstField as keyof CrowdFavoriteVoteFormSchema) : undefined,
      };
    }

    const data = parsed.data;

    if (config.crowd_favorite_password !== data.crowd_favorite_password) {
      return {
        success: false,
        error: "Incorrect crowd favorite password",
        field: "crowd_favorite_password",
      };
    }

    const db = getFirestore();
    const now = Date.now();

    const selectedProjectRef = db.collection(CROWD_FAVORITES_COLLECTION).doc(data.selected_project_id);

    // Find any existing vote outside the transaction (collection group query can't run inside one)
    const previousVotedProjectId = await getUserVotedProjectId(caller.id);
    const previousVoteRef =
      previousVotedProjectId && previousVotedProjectId !== data.selected_project_id
        ? db
            .collection(CROWD_FAVORITES_COLLECTION)
            .doc(previousVotedProjectId)
            .collection(CROWD_FAVORITE_VOTES_SUBCOLLECTION)
            .doc(caller.id)
        : null;

    await db.runTransaction(async (transaction) => {
      const selectedProjectSnapshot = await transaction.get(selectedProjectRef);
      if (!selectedProjectSnapshot.exists) {
        throw new Error("Selected project no longer exists");
      }

      if (previousVoteRef) {
        transaction.delete(previousVoteRef);
      }

      const newVoteRef = selectedProjectRef.collection(CROWD_FAVORITE_VOTES_SUBCOLLECTION).doc(caller.id);

      transaction.set(newVoteRef, {
        id: caller.id,
        created_at: now,
      } as Vote);
    });

    revalidatePath(DASHBOARD_CROWD_FAVORITE_PATH);
    revalidatePath(DASHBOARD_PATH);

    return { success: true };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Crowd favorite submit vote error:", detailedError);

    const isProduction = process.env.APP_ENV === "production";
    const errorMessage = isProduction ? "An unknown error occurred. Please try again." : detailedError;

    return { success: false, error: errorMessage };
  }
};

export { submitCrowdFavoriteVote };
export type { SubmitCrowdFavoriteVoteResult };
