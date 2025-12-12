import { ANNOUNCEMENT_CATEGORIES } from "@/app/dashboard/announcements/_constants/announcement.constants";
import BaseModel from "@/types/base-model.types";

import { Role } from "../../../../types/user.types";

export type AnnouncementCategory = (typeof ANNOUNCEMENT_CATEGORIES)[number];

type Announcement = BaseModel & {
  category: AnnouncementCategory;

  title: string;
  body: string;

  links: string[];

  audience: Role[];
};

export default Announcement;
