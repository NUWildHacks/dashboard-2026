import type { BaseModel } from "@/types";

import { ANNOUNCEMENT_CATEGORIES } from "./constants";

export type AnnouncementCategory = (typeof ANNOUNCEMENT_CATEGORIES)[number];

export type Announcement = BaseModel & {
  category: AnnouncementCategory;

  title: string;
  body: string;

  links: string[];
};
