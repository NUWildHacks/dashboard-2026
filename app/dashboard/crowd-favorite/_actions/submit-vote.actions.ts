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
  USERS_COLLECTION,
} from "@/constants";
import { getAuthenticatedUser, getConfigDocSnapshot, requireRole } from "@/lib";
import type { ActionResult, ParticipantUser, Vote, WildHacksConfig } from "@/types";

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

    if (!isCrowdFavoriteVotingOpen()) {
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

    const configDocSnapshot = await getConfigDocSnapshot();
    const config = configDocSnapshot.data() as WildHacksConfig;

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

    await db.runTransaction(async (transaction) => {
      const selectedProjectSnapshot = await transaction.get(selectedProjectRef);
      if (!selectedProjectSnapshot.exists) {
        throw new Error("Selected project no longer exists");
      }

      const userRef = db.collection(USERS_COLLECTION).doc(caller.id);
      const userSnapshot = await transaction.get(userRef);

      if (!userSnapshot.exists) {
        throw new Error("Authenticated user no longer exists");
      }

      const participant = userSnapshot.data() as Omit<ParticipantUser, "id">;
      const previousVotedProjectId = participant.voted_for_project_id;

      if (previousVotedProjectId) {
        const previousVoteRef = db
          .collection(CROWD_FAVORITES_COLLECTION)
          .doc(previousVotedProjectId)
          .collection(CROWD_FAVORITE_VOTES_SUBCOLLECTION)
          .doc(caller.id);
        transaction.delete(previousVoteRef);
      }

      const newVoteRef = selectedProjectRef.collection(CROWD_FAVORITE_VOTES_SUBCOLLECTION).doc(caller.id);

      transaction.set(newVoteRef, {
        id: caller.id,
        created_at: now,
      } as Vote);

      transaction.update(userRef, {
        voted_for_project_id: data.selected_project_id,
        updated_at: now,
      } as Partial<ParticipantUser>);
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
