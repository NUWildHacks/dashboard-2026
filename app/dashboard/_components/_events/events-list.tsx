import { CalendarX } from "lucide-react";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import Event from "@/types/events"

import EventItem from "./event-item";

type EventsListProps = {
  events: Event[];
}

export default function EventsList({ events }: EventsListProps) {
  if (events.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CalendarX />
          </EmptyMedia>
          <EmptyTitle>No upcoming events</EmptyTitle>
          <EmptyDescription>Check back in closer to the event start date.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return events.map((event) => (
    <EventItem key={event.id} {...event} />
  ))
}
