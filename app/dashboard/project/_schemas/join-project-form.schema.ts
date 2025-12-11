import { z } from "zod";

export const joinProjectFormSchema = z.object({
  join_code: z.string().regex(/^[a-zA-Z0-9]{20}$/, "Invalid join code"),
});

export type JoinProjectFormSchema = z.infer<typeof joinProjectFormSchema>;
