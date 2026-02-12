import type { Event, CalendarRowConfig } from "./types";

export const EVENT_CATEGORIES = ["Food", "Workshop", "Speaker", "Mentorship", "Social"] as const;

export const EVENT_FIELDS = {
  category: "category",
  title: "title",
  body: "body",
  start_time: "start_time",
  end_time: "end_time",
  location: "location",
  created_at: "created_at",
  updated_at: "updated_at",
} as const satisfies Record<keyof Omit<Event, "id">, string>;

export const ROW_HEIGHT = 80 as const;
export const ROW_WIDTH_PERCENTAGE = 100 as const;
export const BASE_Z_INDEX = 10 as const;

export const CALENDAR_ROWS: CalendarRowConfig[] = [
  { startMin: 0, endMin: 60, label: "12 AM" },
  { startMin: 60, endMin: 120, label: "1 AM" },
  { startMin: 120, endMin: 180, label: "2 AM" },
  { startMin: 180, endMin: 240, label: "3 AM" },
  { startMin: 240, endMin: 300, label: "4 AM" },
  { startMin: 300, endMin: 360, label: "5 AM" },
  { startMin: 360, endMin: 420, label: "6 AM" },
  { startMin: 420, endMin: 480, label: "7 AM" },
  { startMin: 480, endMin: 540, label: "8 AM" },
  { startMin: 540, endMin: 600, label: "9 AM" },
  { startMin: 600, endMin: 660, label: "10 AM" },
  { startMin: 660, endMin: 720, label: "11 AM" },
  { startMin: 720, endMin: 780, label: "12 PM" },
  { startMin: 780, endMin: 840, label: "1 PM" },
  { startMin: 840, endMin: 900, label: "2 PM" },
  { startMin: 900, endMin: 960, label: "3 PM" },
  { startMin: 960, endMin: 1020, label: "4 PM" },
  { startMin: 1020, endMin: 1080, label: "5 PM" },
  { startMin: 1080, endMin: 1140, label: "6 PM" },
  { startMin: 1140, endMin: 1200, label: "7 PM" },
  { startMin: 1200, endMin: 1260, label: "8 PM" },
  { startMin: 1260, endMin: 1320, label: "9 PM" },
  { startMin: 1320, endMin: 1380, label: "10 PM" },
  { startMin: 1380, endMin: 1440, label: "11 PM" },
  { startMin: 1440, endMin: 1500, label: "12 AM" },
];
