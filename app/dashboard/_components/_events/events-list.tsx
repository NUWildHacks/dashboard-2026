import { CalendarX } from "lucide-react";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import Event from "@/types/events";

import { UseEventDialogReturn } from "../../_hooks/use-event-dialog";

import EventItem from "./event-item";

type EventsListProps = {
  events: Event[];
  isLoading: boolean;
} & Pick<UseEventDialogReturn, "handleSelectEvent">;

const EventsList = ({ events, isLoading, handleSelectEvent }: EventsListProps) => {
  if (isLoading) {
    return (
      <>
        <Skeleton className="h-[115px] md:h-[86px] w-full" />
        <Skeleton className="h-[115px] md:h-[86px] w-full" />
        <Skeleton className="h-[115px] md:h-[86px] w-full" />
      </>
    );
  }

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
    );
  }

  return events.map((event) => <EventItem key={event.id} handleSelectEvent={handleSelectEvent} {...event} />);
};

export default EventsList;
