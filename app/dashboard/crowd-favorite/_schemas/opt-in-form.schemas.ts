import { z } from "zod";

import { plainTextSingleLineSchema, secureUrlSchema } from "@/lib";

import { CROWD_FAVORITE_MAX_ADDITIONAL_MEMBERS } from "../constants";

const teamMemberSchema = z.object({
  email: z.email("Enter a valid email address").toLowerCase().trim(),
});

export const crowdFavoriteOptInFormSchema = z.object({
  project_name: plainTextSingleLineSchema
    .min(1, "Project name is required")
    .max(100, "Project name must be 100 characters or less"),
  devpost_url: secureUrlSchema,
  team_members: z
    .array(teamMemberSchema)
    .max(
      CROWD_FAVORITE_MAX_ADDITIONAL_MEMBERS,
      `You can add at most ${CROWD_FAVORITE_MAX_ADDITIONAL_MEMBERS} teammate emails`
    )
    .superRefine((teamMembers, ctx) => {
      const normalized = teamMembers.map((member) => member.email.trim().toLowerCase());

      normalized.forEach((email, index) => {
        if (!email) {
          ctx.addIssue({
            code: "custom",
            message: "Teammate email is required",
            path: [index, "email"],
          });
        }
      });

      const seen = new Set<string>();
      normalized.forEach((email, index) => {
        if (!email) return;
        if (seen.has(email)) {
          ctx.addIssue({
            code: "custom",
            message: "Duplicate teammate email",
            path: [index, "email"],
          });
        }
        seen.add(email);
      });
    }),
});

export type CrowdFavoriteOptInFormSchema = z.infer<typeof crowdFavoriteOptInFormSchema>;
