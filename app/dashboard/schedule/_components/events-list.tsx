import { CalendarX } from "lucide-react";

import type { Event } from "@/app/dashboard/schedule/_types";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { UseDialogReturn } from "@/hooks/use-dialog";

import { UseEventsReturn } from "../_hooks";

import EventItem from "./event-item";

type EventsListProps = Pick<UseEventsReturn, "upcomingEvents" | "isLoading"> &
  Pick<UseDialogReturn<Event>, "handleSelectItem">;

const EventsList = ({ upcomingEvents, isLoading, handleSelectItem }: EventsListProps) => {
  if (isLoading) {
    return (
      <>
        <Skeleton className="h-[115px] md:h-[86px] w-full" />
        <Skeleton className="h-[115px] md:h-[86px] w-full" />
        <Skeleton className="h-[115px] md:h-[86px] w-full" />
      </>
    );
  }

  if (upcomingEvents.length === 0) {
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
    );
  }

  return upcomingEvents.map((upcomingEvent) => (
    <EventItem key={upcomingEvent.id} handleSelectItem={handleSelectItem} {...upcomingEvent} />
  ));
};

export default EventsList;
