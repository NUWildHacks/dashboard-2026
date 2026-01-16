import { EVENT_CATEGORIES } from "@/app/dashboard/schedule/_constants";
import type { BaseModel } from "@/types";

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export type Event = BaseModel & {
  category: EventCategory;

  title: string;
  body: string;

  start_time: number;
  end_time: number;
};
