import { CalendarX } from "lucide-react";

import Event from "@/app/dashboard/_types/event.type";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";

import { UseDialogReturn } from "../../_hooks/use-dialog";

import EventItem from "./event-item";

type EventsListProps = {
  events: Event[];
  isLoading: boolean;
} & Pick<UseDialogReturn<Event>, "handleSelectItem">;

const EventsList = ({ events, isLoading, handleSelectItem }: EventsListProps) => {
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

  return events.map((event) => <EventItem key={event.id} handleSelectItem={handleSelectItem} {...event} />);
};

export default EventsList;
