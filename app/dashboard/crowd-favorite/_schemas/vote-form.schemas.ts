import { z } from "zod";

import { plainTextSingleLineSchema } from "@/lib";

export const crowdFavoriteVoteFormSchema = z.object({
  crowd_favorite_password: plainTextSingleLineSchema
    .min(1, "Crowd favorite password is required")
    .max(100, "Password must be 100 characters or less"),
  selected_project_id: z.string().min(1, "Please select a project"),
});

export type CrowdFavoriteVoteFormSchema = z.infer<typeof crowdFavoriteVoteFormSchema>;
