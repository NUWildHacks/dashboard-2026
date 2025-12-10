"use client";

import { createOverlapGroups, getVisibleRowIntervals } from "@/lib/calendar";

import EventDialog from "../../_components/_events/event-dialog";
import { useEventDialog } from "../../_hooks/use-event-dialog";
import { useEvents } from "../../_hooks/use-events";

import CalendarRow from "./calendar-row";

const Calendar = () => {
  const useEventsReturn = useEvents({ limitCount: undefined });
  const { events } = useEventsReturn;

  const useEventDialogReturn = useEventDialog(events);

  const overlapGroups = createOverlapGroups(events);

  const visibleRowIntervals = getVisibleRowIntervals(events);

  return (
    <>
      <div className="w-full flex flex-col py-2">
        {visibleRowIntervals.slice(0, -1).map((calendarRowInterval) => (
          <CalendarRow
            key={calendarRowInterval.label}
            events={events}
            overlapGroups={overlapGroups}
            {...calendarRowInterval}
            {...useEventDialogReturn}
          />
        ))}
        <div className="w-full grid grid-cols-[50px_1fr] space-x-2">
          <div className="relative text-sm h-full">
            <p className="absolute top-0 m-0 w-full text-right -translate-y-1/2">{visibleRowIntervals.at(-1)!.label}</p>
          </div>
          <div className="h-full border-t border-dashed" />
        </div>
      </div>
      <EventDialog {...useEventDialogReturn} />
    </>
  );
};

export default Calendar;
