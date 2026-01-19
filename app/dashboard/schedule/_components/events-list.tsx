import { CalendarX } from "lucide-react";

import { EventItem } from "@/app/dashboard/schedule/_components";
import { UseEventsReturn } from "@/app/dashboard/schedule/_hooks";
import type { Event } from "@/app/dashboard/schedule/_types";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import type { UseDialogReturn } from "@/hooks";

type EventsListProps = Pick<UseEventsReturn, "upcomingEvents" | "isLoading"> &
  Pick<UseDialogReturn<Event>, "handleSelectItem" | "handleKeyDown">;

const EventsList = ({ upcomingEvents, isLoading, handleSelectItem, handleKeyDown }: EventsListProps) => {
  if (isLoading) {
    return (
      <>
        <span className="sr-only">Loading events, please wait</span>
        <Skeleton className="h-[80px] w-full" aria-hidden="true" />
        <Skeleton className="h-[80px] w-full" aria-hidden="true" />
        <Skeleton className="h-[80px] w-full" aria-hidden="true" />
      </>
    );
  }

  if (upcomingEvents.length === 0) {
    return (
      <Empty role="status" aria-live="polite">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CalendarX aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No upcoming events</EmptyTitle>
          <EmptyDescription>Events will be added closer to the event start date. Check back soon!</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ul className="flex flex-col gap-4 w-full" aria-label="Upcoming events list">
      {upcomingEvents.map((upcomingEvent) => (
        <li key={upcomingEvent.id}>
          <EventItem handleSelectItem={handleSelectItem} handleKeyDown={handleKeyDown} {...upcomingEvent} />
        </li>
      ))}
    </ul>
  );
};

export default EventsList;
