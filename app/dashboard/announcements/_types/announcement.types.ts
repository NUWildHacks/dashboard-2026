import { ANNOUNCEMENT_CATEGORIES } from "@/app/dashboard/announcements/_constants";
import type { BaseModel, Role } from "@/types";

export type AnnouncementCategory = (typeof ANNOUNCEMENT_CATEGORIES)[number];

export type Announcement = BaseModel & {
  category: AnnouncementCategory;

  title: string;
  body: string;

  links: string[];

  audience: Role[];
};
