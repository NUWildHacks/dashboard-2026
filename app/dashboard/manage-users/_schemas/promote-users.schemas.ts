import { z } from "zod";

import { userIdSchema } from "@/lib";

/** The ids of the waitlisted users to promote. Waitlisted rows always have a sign-in (UUID) id. */
export const promoteUsersSchema = z
  .array(userIdSchema)
  .min(1, {
    message: "Select at least one user to promote",
  });

export type PromoteUsersSchema = z.infer<
  typeof promoteUsersSchema
>;
