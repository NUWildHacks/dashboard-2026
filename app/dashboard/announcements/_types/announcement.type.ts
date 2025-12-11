import { ANNOUNCEMENT_CATEGORIES } from "@/app/dashboard/announcements/_constants/announcement.constant";

import { Role } from "../../../../types/user";

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

export default Announcement;
