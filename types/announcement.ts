import { Timestamp } from "firebase/firestore";

import { CATEGORIES } from "@/constants/announcement";

export type Category = (typeof CATEGORIES)[number];

export type Announcement = {
  id: string;

  category: Category;

  title: string;
  content: string;

  created_at: Timestamp;
};
