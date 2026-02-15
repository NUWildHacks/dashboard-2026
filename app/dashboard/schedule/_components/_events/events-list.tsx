import { CalendarX } from "lucide-react";

import { EventItem } from "@/app/dashboard/schedule/_components";
import { UseEventsReturn } from "@/app/dashboard/schedule/_hooks";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import type { UseItemDialogReturn } from "@/hooks";

import type { Event } from "../../types";

type EventsListProps = Pick<UseEventsReturn, "events" | "isLoading"> &
  Pick<UseItemDialogReturn<Event>, "handleSelectItem" | "handleKeyDown">;

const EventsList = ({ events, isLoading, handleSelectItem, handleKeyDown }: EventsListProps) => {
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

  if (events.length === 0) {
    return (
      <Empty role="status" aria-live="polite">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CalendarX aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No upcoming events</EmptyTitle>
          <EmptyDescription>More events will be added in the future. Check back soon!</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ul className="flex flex-col gap-4 w-full" aria-label="Events list">
      {events.map((event) => (
        <li key={event.id}>
          <EventItem handleSelectItem={handleSelectItem} handleKeyDown={handleKeyDown} {...event} />
        </li>
      ))}
    </ul>
  );
};

export default EventsList;
