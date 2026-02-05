import { z } from "zod";

import { plainTextMultiLineSchema, plainTextSingleLineSchema, secureUrlSchema } from "@/lib";

export const createProjectFormSchema = z.object({
  name: plainTextSingleLineSchema
    .min(1, "Project name is required")
    .max(100, "Project name must be 100 characters or less"),
  description: plainTextMultiLineSchema
    .min(1, "Project description is required")
    .max(2000, "Project description must be 2000 characters or less"),
  github_url: secureUrlSchema.optional().or(z.literal("")),
});

export type CreateProjectFormSchema = z.infer<typeof createProjectFormSchema>;
