"use client";

import type { UseItemDialogReturn } from "@/hooks";

import { getCalendarItems } from "../../_lib";
import { ROW_HEIGHT } from "../../constants";
import type { CalendarDay, CalendarRowConfig, Event } from "../../types";

type CalendarRowProps = {
  events: Event[];
  overlapGroups: Map<Event["id"], Set<Event["id"]>>;
  calendarDayStartMs: CalendarDay["startMs"];
} & CalendarRowConfig &
  Pick<UseItemDialogReturn<Event>, "handleSelectItem" | "handleKeyDown">;

const CalendarRow = ({
  events,
  overlapGroups,
  startMin: calendarRowStartMin,
  endMin: calendarRowEndMin,
  label,
  handleSelectItem,
  handleKeyDown,
  calendarDayStartMs,
}: CalendarRowProps) => {
  const calendarItems = getCalendarItems(
    events,
    overlapGroups,
    calendarRowStartMin,
    calendarRowEndMin,
    handleSelectItem,
    handleKeyDown,
    calendarDayStartMs
  );

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
