import { z } from "zod";

import { firestoreUserIdSchema, plainTextSingleLineSchema, secureUrlSchema } from "@/lib";

import { ROOMS, TRACKS } from "../../judging/constants";

/** CSV parsers (e.g. Papa Parse) yield string cells; trim avoids Excel trailing spaces breaking Number(). */
const csvNumber = (schema: z.ZodNumber) =>
  z.preprocess((val) => (typeof val === "string" ? val.trim() : val), z.coerce.number().pipe(schema));

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
  order: csvNumber(z.number()),
  judging_round: csvNumber(
    z
      .number()
      .int("Judging round must be a whole number")
      .min(1, "Judging round is required")
      .max(2, "Judging round must be 2 or less")
  ),
  room_id: z.union([z.literal(""), z.enum(ROOMS, { message: "Invalid room" })]),
});

export const judgingAssignmentsCsvArraySchema = z.array(judgingAssignmentsCsvSchema);

export type JudgingAssignmentsCsvArraySchema = z.infer<typeof judgingAssignmentsCsvArraySchema>;
