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
      <div role="status" aria-live="polite" aria-busy="true" aria-label="Loading events">
        <span className="sr-only">Loading events, please wait</span>
        <Skeleton className="h-[115px] md:h-[86px] w-full" aria-hidden="true" />
        <Skeleton className="h-[115px] md:h-[86px] w-full" aria-hidden="true" />
        <Skeleton className="h-[115px] md:h-[86px] w-full" aria-hidden="true" />
      </div>
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
          <EmptyDescription>We will be adding events closer to the event start date. Check back soon!</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return upcomingEvents.map((upcomingEvent) => (
    <EventItem
      key={upcomingEvent.id}
      handleSelectItem={handleSelectItem}
      handleKeyDown={handleKeyDown}
      {...upcomingEvent}
    />
  ));
};

export default EventsList;
