"use client";

import { memo } from "react";

import { ROW_HEIGHT } from "@/constants/calendar";
import { getEventLayouts } from "@/lib/calendar";
import { CalendarRowInterval } from "@/types/calendar";
import Event from "@/types/events";

import { UseEventDialogReturn } from "../../_hooks/use-event-dialog";

import CalendarItem from "./calendar-item";

type CalendarRowProps = {
  events: Event[];
  overlapGroups: Map<Event["id"], Set<Event["id"]>>;
} & CalendarRowInterval &
  Pick<UseEventDialogReturn, "handleSelectEvent">;

const CalendarRow = ({ start, end, label, events, overlapGroups, handleSelectEvent }: CalendarRowProps) => {
  const filteredEvents = events.filter((event) => event.start >= start && event.start < end);

  const eventLayouts = getEventLayouts(filteredEvents, events, start, end, overlapGroups);

  return (
    <div className={`w-full h-[${ROW_HEIGHT}px] grid grid-cols-[50px_1fr] space-x-2`}>
      <div className="relative text-sm h-full">
        <p className="absolute top m-0 w-full text-right -translate-y-1/2">{label}</p>
      </div>
      <div className="relative h-full border-t border-dashed">
        {eventLayouts.map((eventLayout) => (
          <CalendarItem key={eventLayout.event.id} {...eventLayout} handleSelectEvent={handleSelectEvent} />
        ))}
      </div>
    </div>
  );
};

export default memo(CalendarRow);
