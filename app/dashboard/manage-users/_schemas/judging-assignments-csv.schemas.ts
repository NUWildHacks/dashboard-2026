import { z } from "zod";

import { firestoreUserIdSchema, plainTextSingleLineSchema, secureUrlSchema } from "@/lib";

import { TRACKS } from "../../judging/constants";

export const judgingAssignmentsCsvSchema = z.object({
  judge_id: firestoreUserIdSchema,
  judge_email: z.email("Invalid email address"),
  judge_first_name: plainTextSingleLineSchema
    .min(1, "First name is required")
    .max(50, "First name must be 50 characters or less"),
  judge_last_name: plainTextSingleLineSchema
    .min(1, "Last name is required")
    .max(50, "Last name must be 50 characters or less"),
  track: z.enum(TRACKS, { message: "Invalid track" }),
  project_id: plainTextSingleLineSchema
    .min(1, "Project ID is required")
    .max(100, "Project ID must be 100 characters or less"),
  project_name: plainTextSingleLineSchema
    .min(1, "Project name is required")
    .max(100, "Project name must be 100 characters or less"),
  devpost_url: secureUrlSchema,
});

export const judgingAssignmentsCsvArraySchema = z.array(judgingAssignmentsCsvSchema);

export type JudgingAssignmentsCsvSchema = z.infer<typeof judgingAssignmentsCsvSchema>;
export type JudgingAssignmentsCsvArraySchema = z.infer<typeof judgingAssignmentsCsvArraySchema>;
