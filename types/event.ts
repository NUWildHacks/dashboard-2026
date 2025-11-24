import { EVENT_STATES } from "@/constants/event";

type Event = {
  state: (typeof EVENT_STATES)[number];

  registration_deadline: number;
  ongoing_event_deadline: number;

  updated_at: number;
};

export default Event;
