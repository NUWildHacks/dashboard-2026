"use server";

import { getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

import {
  LOGIN_PATH,
  DASHBOARD_JUDGING_PATH,
  JUDGE,
  PROJECTS_COLLECTION,
  JUDGING_ASSIGNMENTS_COLLECTION,
} from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { ActionResult, JudgeUser } from "@/types";

import { type JudgingFormSchema } from "../_schemas";
import type { JudgingAssignment, JudgingForm, Project } from "../types";

export type SubmitJudgingResult = ActionResult<JudgingFormSchema>;

export const submitJudging = async (
  data: JudgingFormSchema,
  projectId: Project["id"],
  judgeId: JudgeUser["id"]
): Promise<SubmitJudgingResult> => {
  const db = getFirestore();
  const now = Date.now();

  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_JUDGING_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);

    const roleError = requireRole(user, JUDGE, "You are not authorized to submit judging form");
    if (roleError) return roleError;

    const projectDocSnapshot = await db.collection(PROJECTS_COLLECTION).doc(projectId).get();
    if (!projectDocSnapshot.exists) {
      return {
        success: false,
        error: "Project not found",
      };
    }

    const judgingAssignmentDocSnapshot = await db
      .collection(JUDGING_ASSIGNMENTS_COLLECTION)
      .doc(`${judgeId}_${projectId}`)
      .get();
    if (!judgingAssignmentDocSnapshot.exists) {
      return {
        success: false,
        error: "Judging assignment not found",
      };
    }

    const judgingAssignment = judgingAssignmentDocSnapshot.data() as Omit<JudgingAssignment, "id">;
    const existingForm = judgingAssignment.judging_form;

    await db
      .collection(JUDGING_ASSIGNMENTS_COLLECTION)
      .doc(`${judgeId}_${projectId}`)
      .update({
        judging_form: {
          ...data,
          created_at: existingForm?.created_at ?? now,
          updated_at: now,
        } as Partial<JudgingForm>,
      } as Partial<JudgingAssignment>);

    revalidatePath(DASHBOARD_JUDGING_PATH);

    return { success: true };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Submit judging form error:", detailedError);

    const isProduction = process.env.APP_ENV === "production";
    const errorMessage = isProduction ? "An unknown error occurred. Please try again." : detailedError;

    return { success: false, error: errorMessage };
  }
};
