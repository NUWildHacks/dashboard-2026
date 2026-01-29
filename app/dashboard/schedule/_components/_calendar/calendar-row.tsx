"use client";

import type { UseDialogReturn } from "@/hooks";

import { ROW_HEIGHT } from "../../constants";
import { getCalendarItems } from "../../lib";
import type { CalendarRowConfig, Event } from "../../types";

type CalendarRowProps = {
  events: Event[];
  overlapGroups: Map<Event["id"], Set<Event["id"]>>;
  dayStart: number;
} & CalendarRowConfig &
  Pick<UseDialogReturn<Event>, "handleSelectItem">;

const CalendarRow = ({ events, overlapGroups, start, end, label, handleSelectItem, dayStart }: CalendarRowProps) => {
  const calendarItems = getCalendarItems(events, start, end, overlapGroups, handleSelectItem, dayStart);

  return (
    <div className={`w-full h-[${ROW_HEIGHT}px] grid grid-cols-[50px_1fr] space-x-2`}>
      <div className="relative text-sm h-full">
        <p className="absolute top m-0 w-full text-right -translate-y-1/2">{label}</p>
      </div>
      <div className="relative h-full border-t border-dashed">{calendarItems}</div>
    </div>
  );
};

export default CalendarRow;
