import { z } from "zod";

export const createPermissionCodeDialogSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type CreatePermissionCodeDialogSchema = z.infer<typeof createPermissionCodeDialogSchema>;
