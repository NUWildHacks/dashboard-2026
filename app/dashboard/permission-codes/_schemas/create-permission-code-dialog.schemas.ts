import { z } from "zod";

import { PERMISSION_CODE_TYPES } from "../_constants";

export const createPermissionCodeDialogSchema = z.object({
  email: z.string().email("Invalid email address"),
  type: z.enum(PERMISSION_CODE_TYPES, { message: "Type is required" }),
});

export type CreatePermissionCodeDialogSchema = z.infer<typeof createPermissionCodeDialogSchema>;
