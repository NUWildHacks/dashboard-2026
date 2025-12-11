"use client";

import { memo } from "react";

import { ROW_HEIGHT } from "@/app/dashboard/schedule/_constants/calendar.constant";
import { getCalendarItems } from "@/app/dashboard/schedule/_lib/calendar.lib";
import type { CalendarRow, Event } from "@/app/dashboard/schedule/_types";
import { UseDialogReturn } from "@/hooks/use-dialog";

type CalendarRowProps = {
  events: Event[];
  overlapGroups: Map<Event["id"], Set<Event["id"]>>;
} & CalendarRow &
  Pick<UseDialogReturn<Event>, "handleSelectItem">;

const CalendarRow = ({ events, overlapGroups, start, end, label, handleSelectItem }: CalendarRowProps) => {
  const calendarItems = getCalendarItems(events, start, end, overlapGroups, handleSelectItem);

  return (
    <div className={`w-full h-[${ROW_HEIGHT}px] grid grid-cols-[50px_1fr] space-x-2`}>
      <div className="relative text-sm h-full">
        <p className="absolute top m-0 w-full text-right -translate-y-1/2">{label}</p>
      </div>
      <div className="relative h-full border-t border-dashed">{calendarItems}</div>
    </div>
  );
};

export default memo(CalendarRow);
