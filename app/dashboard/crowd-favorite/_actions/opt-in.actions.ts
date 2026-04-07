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
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { ActionResult, CrowdFavoriteProject, ParticipantUser } from "@/types";

import { crowdFavoriteOptInFormSchema, type CrowdFavoriteOptInFormSchema } from "../_schemas";
import { isCrowdFavoriteOptInOpen } from "../constants";

type CrowdFavoriteOptInResult = ActionResult<CrowdFavoriteOptInFormSchema>;

type CandidateMember = {
  refPath: string;
  id: string;
  first_name: string;
  email: string;
};

const optInToCrowdFavorite = async (rawData: CrowdFavoriteOptInFormSchema): Promise<CrowdFavoriteOptInResult> => {
  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_CROWD_FAVORITE_PATH)}`;
    const caller = await getAuthenticatedUser(redirectPath);

    const roleCheck = requireRole(caller, PARTICIPANT);
    if (roleCheck) return roleCheck;

    if (!isCrowdFavoriteOptInOpen()) {
      return { success: false, error: "Crowd favorite opt-in is currently closed" };
    }

    const parsed = crowdFavoriteOptInFormSchema.safeParse(rawData);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      const firstField = firstIssue.path[0];

      return {
        success: false,
        error: firstIssue.message,
        field: typeof firstField === "string" ? (firstField as keyof CrowdFavoriteOptInFormSchema) : undefined,
      };
    }

    const data = parsed.data;
    const db = getFirestore();
    const now = Date.now();

    const normalizedEmails = data.team_members.map((member) => member.email.trim().toLowerCase());

    if (normalizedEmails.includes(caller.email.toLowerCase())) {
      return {
        success: false,
        error: "Do not include your own email in team members",
        field: "team_members",
      };
    }

    const candidateSnapshots = await Promise.all(
      normalizedEmails.map((email) => db.collection(USERS_COLLECTION).where("email", "==", email).limit(1).get())
    );

    const candidateMembers: CandidateMember[] = [];
    for (let index = 0; index < candidateSnapshots.length; index += 1) {
      const snapshot = candidateSnapshots[index];
      const email = normalizedEmails[index];

      if (snapshot.empty) {
        return { success: false, error: `No participant found for ${email}`, field: "team_members" };
      }

      const doc = snapshot.docs[0];
      const user = doc.data() as Omit<ParticipantUser, "id">;

      if (user.role !== PARTICIPANT) {
        return {
          success: false,
          error: `${email} is not a participant`,
          field: "team_members",
        };
      }

      if (user.crowd_favorite_project_id) {
        return {
          success: false,
          error: `${email} is already assigned to a crowd favorite project`,
          field: "team_members",
        };
      }

      if (!user.first_name) {
        return {
          success: false,
          error: `${email} has an incomplete participant profile`,
          field: "team_members",
        };
      }

      candidateMembers.push({
        refPath: doc.ref.path,
        id: doc.id,
        first_name: user.first_name,
        email,
      });
    }

    const callerRef = db.collection(USERS_COLLECTION).doc(caller.id);
    const crowdFavoriteRef = db.collection(CROWD_FAVORITES_COLLECTION).doc();

    await db.runTransaction(async (transaction) => {
      const callerSnapshot = await transaction.get(callerRef);
      if (!callerSnapshot.exists) {
        throw new Error("Authenticated user no longer exists");
      }

      const callerData = callerSnapshot.data() as Omit<ParticipantUser, "id">;
      if (callerData.role !== PARTICIPANT) {
        throw new Error("Only participants can opt in to crowd favorite");
      }

      if (callerData.crowd_favorite_project_id) {
        throw new Error("You are already assigned to a crowd favorite project");
      }

      const teammateRefs = candidateMembers.map((member) => db.doc(member.refPath));
      const teammateSnapshots = await Promise.all(teammateRefs.map((ref) => transaction.get(ref)));

      teammateSnapshots.forEach((snapshot, index) => {
        const teammateEmail = candidateMembers[index].email;

        if (!snapshot.exists) {
          throw new Error(`Participant ${teammateEmail} no longer exists`);
        }

        const teammateData = snapshot.data() as Omit<ParticipantUser, "id">;
        if (teammateData.role !== PARTICIPANT) {
          throw new Error(`${teammateEmail} is not a participant`);
        }

        if (teammateData.crowd_favorite_project_id) {
          throw new Error(`${teammateEmail} was assigned to another crowd favorite project`);
        }
      });

      const teamMembers: CrowdFavoriteProject["team_members"] = [
        {
          id: caller.id,
          first_name: caller.first_name,
          email: caller.email.toLowerCase(),
        },
        ...candidateMembers.map((member) => ({
          id: member.id,
          first_name: member.first_name,
          email: member.email,
        })),
      ];

      transaction.set(crowdFavoriteRef, {
        project_name: data.project_name,
        devpost_url: data.devpost_url,
        team_members: teamMembers,
        created_at: now,
        updated_at: now,
      } as Omit<CrowdFavoriteProject, "id">);

      transaction.update(callerRef, {
        crowd_favorite_project_id: crowdFavoriteRef.id,
        updated_at: now,
      } as Partial<ParticipantUser>);

      teammateRefs.forEach((teammateRef) => {
        transaction.update(teammateRef, {
          crowd_favorite_project_id: crowdFavoriteRef.id,
          updated_at: now,
        } as Partial<ParticipantUser>);
      });
    });

    revalidatePath(DASHBOARD_CROWD_FAVORITE_PATH);
    revalidatePath(DASHBOARD_PATH);

    return { success: true };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Crowd favorite opt-in error:", detailedError);

    const isProduction = process.env.APP_ENV === "production";
    const errorMessage = isProduction ? "An unknown error occurred. Please try again." : detailedError;

    return { success: false, error: errorMessage };
  }
};

export { optInToCrowdFavorite };
export type { CrowdFavoriteOptInResult };
