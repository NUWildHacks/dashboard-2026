"use server";

import { getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

import { LOGIN_PATH, DASHBAORD_JUDGING_PATH, JUDGE, JUDGING_FORMS_COLLECTION, PROJECTS_COLLECTION } from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { ActionResult, JudgeUser } from "@/types";

import { type JudgingFormSchema } from "../_schemas";
import { JUDGING_FORM_FIELDS } from "../constants";
import type { Project } from "../types";
import { JudgingForm } from "../types";

export type SubmitJudgingResult = ActionResult<JudgingFormSchema>;

export const submitJudging = async (
  data: JudgingFormSchema,
  projectData: Pick<Project, "id" | "name">,
  judgeData: Pick<JudgeUser, "id" | "first_name" | "last_name">
): Promise<SubmitJudgingResult> => {
  const db = getFirestore();
  const now = Date.now();

  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBAORD_JUDGING_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);

    const roleError = requireRole(user, JUDGE, "You are not authorized to submit judging form");
    if (roleError) return roleError;

    const { id: projectId, name: projectName } = projectData;
    const { id: judgeId, first_name: judgeFirstName, last_name: judgeLastName } = judgeData;

    const projectDocSnapshot = await db.collection(PROJECTS_COLLECTION).doc(projectId).get();
    if (!projectDocSnapshot.exists) {
      return {
        success: false,
        error: "Project not found",
      };
    }

    const judgingFormSnapshots = await db
      .collection(JUDGING_FORMS_COLLECTION)
      .where(JUDGING_FORM_FIELDS.project_id, "==", projectId)
      .get();
    if (judgingFormSnapshots.docs.length > 0) {
      return {
        success: false,
        error: "Judging form already submitted for this project",
      };
    }

    await db
      .collection(JUDGING_FORMS_COLLECTION)
      .doc()
      .set({
        ...data,
        judge_id: judgeId,
        judge_first_name: judgeFirstName,
        judge_last_name: judgeLastName,
        project_id: projectId,
        project_name: projectName,
        created_at: now,
        updated_at: now,
      } as Omit<JudgingForm, "id">);

    revalidatePath(DASHBAORD_JUDGING_PATH);

    return { success: true };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Submit judging form error:", detailedError);

    const isProduction = process.env.APP_ENV === "production";
    const errorMessage = isProduction ? "An unknown error occurred. Please try again." : detailedError;

    return { success: false, error: errorMessage };
  }
};
