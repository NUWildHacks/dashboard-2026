import { z } from "zod";

import { plainTextMultiLineSchema, plainTextSingleLineSchema, secureUrlSchema } from "@/lib";

import { ANNOUNCEMENT_CATEGORIES } from "../constants";

export const announcementFormSchema = z.object({
  title: plainTextSingleLineSchema
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must be 100 characters or less" }),
  body: plainTextMultiLineSchema
    .min(1, { message: "Body is required" })
    .max(800, { message: "Body must be 800 characters or less" }),
  category: z.enum(ANNOUNCEMENT_CATEGORIES, { message: "Category is required" }),
  links: z.array(z.object({ url: secureUrlSchema })).max(4, { message: "Maximum of 4 links allowed" }),
});

export type AnnouncementFormSchema = z.infer<typeof announcementFormSchema>;
