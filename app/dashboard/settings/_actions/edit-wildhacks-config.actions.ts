"use server";

import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import { LOGIN_PATH, DASHBOARD_SETTINGS_PATH, WILDHACKS_COLLECTION, WILDHACKS_CONFIG_DOC, ADMIN } from "@/constants";
import { verifySession } from "@/lib";
import { getUserDocSnapshot } from "@/lib/user.lib";
import type { ActionResult, User } from "@/types";

import { EditWildhacksConfigFormSchema } from "../_schemas/edit-wildhacks-config-form.schemas";

export type EditWildhacksConfigResult = ActionResult<EditWildhacksConfigFormSchema>;

export const editWildhacksConfig = async (data: EditWildhacksConfigFormSchema): Promise<EditWildhacksConfigResult> => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_SETTINGS_PATH)}`);

  const db = getFirestore();
  const now = Date.now();

  try {
    const userDocSnapshot = await getUserDocSnapshot(userId);
    if (!userDocSnapshot.exists) {
      return {
        success: false,
        error: "User document not found",
      };
    }

    const user = userDocSnapshot.data() as Omit<User, "id">;
    const { role } = user;

    if (role !== ADMIN) {
      return {
        success: false,
        error: "You are not authorized to edit the Wildhacks config",
      };
    }

    const configDocRef = db.collection(WILDHACKS_COLLECTION).doc(WILDHACKS_CONFIG_DOC);

    const { max_team_size, ...rest } = data;
    await configDocRef.update({
      ...rest,
      max_team_size: Number(max_team_size) || 4,
      updated_at: now,
    });

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Edit wildhacks config error:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
};
