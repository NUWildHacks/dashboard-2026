import { EVENT_CATEGORIES } from "@/constants/event"

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

type Event = {
  id: string;

  category: EventCategory;

  title: string;

  start: number;
  end: number;
}

export default Event
