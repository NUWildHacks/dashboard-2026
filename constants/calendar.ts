import { CalendarRowInterval } from "@/types/calendar";

export const ROW_HEIGHT = 80 as const;
export const OFFSET_PERCENTAGE = 3 as const;
export const ROW_WIDTH_PERCENTAGE = 100 as const;
export const BASE_Z_INDEX = 10 as const;

export const DEFAULT_FIRST_CALENDAR_ROW_INTERVAL_INDEX = 9 as const;
export const DEFAULT_LAST_CALENDAR_ROW_INTERVAL_INDEX = 18 as const;

export const CALENDAR_ROW_INTERVALS: CalendarRowInterval[] = [
  { start: 0, end: 60, label: "12 AM" },
  { start: 60, end: 120, label: "1 AM" },
  { start: 120, end: 180, label: "2 AM" },
  { start: 180, end: 240, label: "3 AM" },
  { start: 240, end: 300, label: "4 AM" },
  { start: 300, end: 360, label: "5 AM" },
  { start: 360, end: 420, label: "6 AM" },
  { start: 420, end: 480, label: "7 AM" },
  { start: 480, end: 540, label: "8 AM" },
  { start: 540, end: 600, label: "9 AM" },
  { start: 600, end: 660, label: "10 AM" },
  { start: 660, end: 720, label: "11 AM" },
  { start: 720, end: 780, label: "12 PM" },
  { start: 780, end: 840, label: "1 PM" },
  { start: 840, end: 900, label: "2 PM" },
  { start: 900, end: 960, label: "3 PM" },
  { start: 960, end: 1020, label: "4 PM" },
  { start: 1020, end: 1080, label: "5 PM" },
  { start: 1080, end: 1140, label: "6 PM" },
  { start: 1140, end: 1200, label: "7 PM" },
  { start: 1200, end: 1260, label: "8 PM" },
  { start: 1260, end: 1320, label: "9 PM" },
  { start: 1320, end: 1380, label: "10 PM" },
  { start: 1380, end: 1440, label: "11 PM" },
  { start: 1440, end: 1500, label: "12 AM" },
];
