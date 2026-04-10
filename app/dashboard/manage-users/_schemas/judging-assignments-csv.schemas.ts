import { z } from "zod";

import { firestoreUserIdSchema, plainTextSingleLineSchema, secureUrlSchema } from "@/lib";

import { ROOMS, TRACKS } from "../../judging/constants";

const judgingAssignmentsCsvSchema = z.object({
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
  order: z.number(),
  judging_round: z.number().min(1, "Judging round is required").max(2, "Judging round must be 2 or less"),
  room_id: z.enum(ROOMS, { message: "Invalid room" }),
});

export const judgingAssignmentsCsvArraySchema = z.array(judgingAssignmentsCsvSchema);

export type JudgingAssignmentsCsvArraySchema = z.infer<typeof judgingAssignmentsCsvArraySchema>;
