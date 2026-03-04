import { z } from "zod";

import { plainTextMultiLineSchema, plainTextSingleLineSchema } from "@/lib";

export const judgingFormSchema = z.object({
  project_id: z
    .string()
    .regex(/^[a-zA-Z0-9]{20}$/, "Invalid project ID")
    .or(z.literal("")),
  project_name: plainTextSingleLineSchema
    .min(1, "Project selection required")
    .max(100, "Project selection must be 100 characters or less"),
  technical_complexity: z.number().min(1, "Technical complexity is required").max(4),
  usefulness: z.number().min(1, "Usefulness is required").max(4),
  originality: z.number().min(1, "Originality is required").max(4),
  design: z.number().min(1, "Design is required").max(4),
  presentation: z.number().min(1, "Presentation is required").max(4),
  comments: plainTextMultiLineSchema.optional(),
});

export type JudgingFormSchema = z.infer<typeof judgingFormSchema>;
