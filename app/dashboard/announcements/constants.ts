import { Announcement } from "./types";

export const URGENT = "Urgent" as const;
export const SCHEDULE = "Schedule" as const;
export const FOOD = "Food" as const;
export const SOCIAL = "Social" as const;

export const ANNOUNCEMENT_CATEGORIES = [URGENT, SCHEDULE, FOOD, SOCIAL] as const;

export const ANNOUNCEMENT_FIELDS = {
  category: "category",
  title: "title",
  body: "body",
  links: "links",
  created_at: "created_at",
  updated_at: "updated_at",
} as const satisfies Record<keyof Omit<Announcement, "id">, string>;
