import { Timestamp } from "firebase/firestore";

import { CATEGORIES } from "@/constants/announcement";

import { Role } from "./user";

export type Category = (typeof CATEGORIES)[number];

export type Announcement = {
  id: string;

  category: Category;

  title: string;
  body: string;

  links: string[];

  author: string;

  audience: Role[];

  created_at: Timestamp;
};
