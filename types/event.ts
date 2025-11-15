import { Timestamp } from "firebase/firestore";

import { EVENT_STATES } from "@/constants/event";

type Event = {
  state: (typeof EVENT_STATES)[number];

  registration_deadline: Timestamp;
  ongoing_event_deadline: Timestamp;

  updated_at: Timestamp;
};

export default Event;
