import { z } from "zod";

import { ANNOUNCEMENT_CATEGORIES } from "../constants";

export const createAnnouncementDialogSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  body: z.string().min(1, { message: "Body is required" }),
  category: z.enum(ANNOUNCEMENT_CATEGORIES, { message: "Category is required" }),
  links: z.array(z.object({ url: z.url() })).max(4, { message: "Maximum of 5 links allowed" }),
});

export type CreateAnnouncementDialogSchema = z.infer<typeof createAnnouncementDialogSchema>;
