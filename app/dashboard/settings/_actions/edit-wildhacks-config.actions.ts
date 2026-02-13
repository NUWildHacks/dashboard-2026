"use server";

import { getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

import { ADMIN, DASHBOARD_SETTINGS_PATH, LOGIN_PATH, WILDHACKS_COLLECTION, WILDHACKS_CONFIG_DOC } from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import type { ActionResult } from "@/types";

import { EditWildhacksConfigFormSchema } from "../_schemas/edit-wildhacks-config-form.schemas";

export type EditWildhacksConfigResult = ActionResult<EditWildhacksConfigFormSchema>;

export const editWildhacksConfig = async (data: EditWildhacksConfigFormSchema): Promise<EditWildhacksConfigResult> => {
  const db = getFirestore();
  const now = Date.now();

  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_SETTINGS_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);

    const roleError = requireRole(user, ADMIN, "You are not authorized to edit the Wildhacks config");
    if (roleError) return roleError;

    const { max_team_size, max_participants, ...rest } = data;

    await db
      .collection(WILDHACKS_COLLECTION)
      .doc(WILDHACKS_CONFIG_DOC)
      .update({
        ...rest,
        max_team_size: Number(max_team_size),
        max_participants: Number(max_participants),
        updated_at: now,
      });

    revalidatePath(DASHBOARD_SETTINGS_PATH);

    return { success: true };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Edit wildhacks config error:", detailedError);

    const isProduction = process.env.APP_ENV === "production";
    const errorMessage = isProduction ? "An unknown error occurred. Please try again." : detailedError;

    return { success: false, error: errorMessage };
  }
};
