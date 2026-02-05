import { z } from "zod";

import { plainTextMultiLineSchema, plainTextSingleLineSchema, secureUrlSchema } from "@/lib";

import { ANNOUNCEMENT_CATEGORIES } from "../constants";

export const createAnnouncementDialogSchema = z.object({
  title: plainTextSingleLineSchema
    .min(1, { message: "Title is required" })
    .max(200, { message: "Title must be 200 characters or less" }),
  body: plainTextMultiLineSchema
    .min(1, { message: "Body is required" })
    .max(2500, { message: "Body must be 2500 characters or less" }),
  category: z.enum(ANNOUNCEMENT_CATEGORIES, { message: "Category is required" }),
  links: z.array(z.object({ url: secureUrlSchema })).max(4, { message: "Maximum of 4 links allowed" }),
});

export type CreateAnnouncementDialogSchema = z.infer<typeof createAnnouncementDialogSchema>;
