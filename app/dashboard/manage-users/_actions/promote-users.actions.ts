"use server";

import { revalidatePath } from "next/cache";

import supabaseAdmin from "@/config/supabase-admin";
import {
  ADMIN,
  DASHBOARD_MANAGE_USERS_PATH,
  LOGIN_PATH,
  PARTICIPANT,
  USERS_TABLE,
  WAITLISTED,
} from "@/constants";
import { chunkList } from "@/lib";
import {
  getAuthenticatedUser,
  requireRole,
} from "@/lib/server";
import type { ActionResult, User } from "@/types";

import { promoteUsersSchema } from "../_schemas";

/** On success, `promoted` is the number of waitlisted users that became participants. */
export type PromoteUsersResult =
  | { success: true; promoted: number }
  | Extract<ActionResult, { success: false }>;

/**
 * Move waitlisted users to the Participant role. Admins may promote past max_participants (the
 * confirm dialog warns them), so this action does not check the participant limit. Rows that are
 * no longer Waitlisted (for example, already promoted by another admin) are skipped.
 */
export const promoteUsers = async (
  userIds: User["id"][]
): Promise<PromoteUsersResult> => {
  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_MANAGE_USERS_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);

    const roleError = requireRole(
      user,
      ADMIN,
      "You are not authorized to promote users"
    );
    if (roleError?.success === false) return roleError;

    const parsed = promoteUsersSchema.safeParse(userIds);
    if (!parsed.success) {
      return {
        success: false,
        error:
          parsed.error.issues[0]?.message ??
          "Invalid user ids",
      };
    }

    const now = Date.now();
    let promoted = 0;
    for (const ids of chunkList([
      ...new Set(parsed.data),
    ])) {
      const { data: rows } = await supabaseAdmin
        .from(USERS_TABLE)
        .update({ role: PARTICIPANT, updated_at: now })
        .in("id", ids)
        .eq("role", WAITLISTED)
        .select("id")
        .throwOnError();
      promoted += rows.length;
    }

    revalidatePath(DASHBOARD_MANAGE_USERS_PATH);

    return { success: true, promoted };
  } catch (error) {
    const detailedError =
      error instanceof Error
        ? error.message
        : "An unknown error occurred";
    console.error("Promote users error:", detailedError);

    const isProduction =
      process.env.APP_ENV === "production";
    const errorMessage = isProduction
      ? "An unknown error occurred. Please try again."
      : detailedError;

    return { success: false, error: errorMessage };
  }
};
