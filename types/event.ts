import { EVENT_STATES } from "@/constants/event";

export type EventConfig = {
  state: (typeof EVENT_STATES)[number];

  event_started_at: number | null;

  event_duration: number;

  updated_at: number;
};

export type EventStatistics = {
  participants: number;
  judges: number;
  admins: number;
  projects: number;
  submissions: number;

  updated_at: number;
};
