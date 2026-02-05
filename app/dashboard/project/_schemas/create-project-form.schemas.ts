import { z } from "zod";

import { secureUrlSchema } from "@/lib";

export const createProjectFormSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Project description is required"),
  github_url: secureUrlSchema.optional().or(z.literal("")),
});

export type CreateProjectFormSchema = z.infer<typeof createProjectFormSchema>;
