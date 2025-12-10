import { ANNOUNCEMENT_CATEGORIES } from "@/constants/announcement";

import { Role } from "./user";

export type AnnouncementCategory = (typeof ANNOUNCEMENT_CATEGORIES)[number];

type Announcement = {
  id: string;

  category: AnnouncementCategory;

  title: string;
  body: string;

  links: string[];

  audience: Role[];

  created_at: number;
};

export default Announcement
