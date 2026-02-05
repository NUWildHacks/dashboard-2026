import { z } from "zod";

import { plainTextMultiLineSchema, plainTextSingleLineSchema, secureUrlSchema } from "@/lib";

export const createProjectFormSchema = z.object({
  name: plainTextSingleLineSchema.min(1, "Project name is required"),
  description: plainTextMultiLineSchema.min(1, "Project description is required"),
  github_url: secureUrlSchema.optional().or(z.literal("")),
});

export type CreateProjectFormSchema = z.infer<typeof createProjectFormSchema>;
