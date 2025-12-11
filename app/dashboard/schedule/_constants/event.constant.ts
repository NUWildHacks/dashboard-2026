import type { Event } from "@/app/dashboard/schedule/_types";

export const FOOD = "Food" as const;
export const WORKSHOP = "Workshop" as const;
export const SPEAKER = "Speaker" as const;
export const MENTORSHOP = "Mentorship" as const;
export const SOCIAL = "Social" as const;

export const EVENT_CATEGORIES = [FOOD, WORKSHOP, SPEAKER, MENTORSHOP, SOCIAL] as const;

export const EVENT_FIELDS = {
  category: "category",
  title: "title",
  body: "body",
  start: "start",
  end: "end",
  created_at: "created_at",
} as const satisfies Record<keyof Omit<Event, "id">, string>;
