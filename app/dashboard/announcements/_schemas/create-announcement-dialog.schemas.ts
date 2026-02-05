import { z } from "zod";

import { plainTextMultiLineSchema, plainTextSingleLineSchema, secureUrlSchema } from "@/lib";

import { ANNOUNCEMENT_CATEGORIES } from "../constants";

export const createAnnouncementDialogSchema = z.object({
  title: plainTextSingleLineSchema.min(1, { message: "Title is required" }),
  body: plainTextMultiLineSchema.min(1, { message: "Body is required" }),
  category: z.enum(ANNOUNCEMENT_CATEGORIES, { message: "Category is required" }),
  links: z.array(z.object({ url: secureUrlSchema })).max(4, { message: "Maximum of 4 links allowed" }),
});

export type CreateAnnouncementDialogSchema = z.infer<typeof createAnnouncementDialogSchema>;
