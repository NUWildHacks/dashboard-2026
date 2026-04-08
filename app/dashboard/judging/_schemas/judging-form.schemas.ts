import { z } from "zod";

import { plainTextMultiLineSchema } from "@/lib";

export const judgingFormSchema = z.object({
  technical_complexity: z.number().min(1, "Technical complexity is required").max(4),
  usefulness: z.number().min(1, "Usefulness is required").max(4),
  originality: z.number().min(1, "Originality is required").max(4),
  design: z.number().min(1, "Design is required").max(4),
  presentation: z.number().min(1, "Presentation is required").max(4),
  comments: plainTextMultiLineSchema.optional(),
});

export type JudgingFormSchema = z.infer<typeof judgingFormSchema>;
