import { EVENT_CATEGORIES } from "@/app/dashboard/_constants/event.constant";

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

type Event = {
  id: string;

  category: EventCategory;

  title: string;
  body: string;

  start: number;
  end: number;
};

export default Event;
