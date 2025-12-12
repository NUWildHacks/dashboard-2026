import { EVENT_CATEGORIES } from "@/app/dashboard/schedule/_constants/event.constants";
import BaseModel from "@/types/base-model.types";

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

type Event = BaseModel & {
  category: EventCategory;

  title: string;
  body: string;

  start: number;
  end: number;
};

export default Event;
