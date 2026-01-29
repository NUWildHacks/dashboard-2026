import type { BaseModel } from "@/types";

import { EVENT_CATEGORIES } from "./constants";

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export type Event = BaseModel & {
  category: EventCategory;

  title: string;
  body: string;

  start_time: number;
  end_time: number;
};

export type CalendarRowConfig = {
  start: number;
  end: number;
  label: string;
};
