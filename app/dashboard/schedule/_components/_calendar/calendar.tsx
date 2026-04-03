"use client";

import { CalendarRow } from "@/app/dashboard/schedule/_components";
import { UseItemDialogReturn, useWildhacksGlobalSettings } from "@/hooks";

import { UseEventsReturn } from "../../_hooks";
import { createOverlapGroups, getVisibleCalendarRows } from "../../_lib";
import { CalendarDay, Event } from "../../types";

type CalendarProps = Pick<UseEventsReturn, "events"> &
  Pick<CalendarDay, "startMs" | "endMs"> &
  Pick<UseItemDialogReturn<Event>, "handleSelectItem" | "handleKeyDown">;

const Calendar = ({ events, startMs, endMs, handleSelectItem, handleKeyDown }: CalendarProps) => {
  const { start_time, end_time } = useWildhacksGlobalSettings();

  const visibleCalendarRows = getVisibleCalendarRows(start_time, end_time, startMs, endMs);

  const overlapGroups = createOverlapGroups(events);

  return (
    <div className="w-full flex flex-col py-2">
      {visibleCalendarRows.slice(0, -1).map((calendarRow) => (
        <CalendarRow
          key={calendarRow.label}
          events={events}
          calendarDayStartMs={startMs}
          overlapGroups={overlapGroups}
          handleSelectItem={handleSelectItem}
          handleKeyDown={handleKeyDown}
          {...calendarRow}
        />
      ))}
      <div className="w-full grid grid-cols-[50px_1fr] space-x-2">
        <div className="relative text-sm h-full">
          <p className="absolute top-0 m-0 w-full text-right -translate-y-1/2">{visibleCalendarRows.at(-1)!.label}</p>
        </div>
        <div className="h-full border-t border-dashed" />
      </div>
    </div>
  );
};

export default Calendar;
