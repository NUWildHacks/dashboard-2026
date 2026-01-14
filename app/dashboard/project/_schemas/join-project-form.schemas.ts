import { z } from "zod";

export const joinProjectFormSchema = z.object({
  invitation_code: z.string().regex(/^[a-zA-Z0-9]{20}$/, "Invalid invitation code"),
});

export type JoinProjectFormSchema = z.infer<typeof joinProjectFormSchema>;
