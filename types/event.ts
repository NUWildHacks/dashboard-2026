import { EVENT_STATES } from "@/constants/event";

export type EventConfig = {
  state: (typeof EVENT_STATES)[number];

  registration_deadline: number;
  ongoing_event_deadline: number;

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
