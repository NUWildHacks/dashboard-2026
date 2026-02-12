"use client";

import { SearchIcon } from "lucide-react";

import { CalendarRow, CreateEventDialog, EventDialog } from "@/app/dashboard/schedule/_components";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ADMIN } from "@/constants";
import { CategoryWithAll, useDialog, useFilters } from "@/hooks";
import type { User, WildHacksConfig } from "@/types";

import { useEvents } from "../../_hooks";
import { useCalendar } from "../../_hooks/use-calendar";
import { EVENT_CATEGORIES } from "../../constants";
import { createOverlapGroups } from "../../lib";
import type { Event, EventCategory } from "../../types";

type CalendarProps = {
  userRole: User["role"];
} & Pick<WildHacksConfig, "start_time" | "end_time">;

const Calendar = ({ start_time, end_time, userRole }: CalendarProps) => {
  const { category, setCategory, search, setSearch } = useFilters<EventCategory>();

  const { selectedDay, availableDays, visibleCalendarRows, handleSelectDay } = useCalendar(start_time, end_time);
  const { label, startMs } = selectedDay;

  const useEventsReturn = useEvents({ category, search, selectedDay });
  const { events } = useEventsReturn;

  const useEventDialogReturn = useDialog<Event>(events);

  const overlapGroups = createOverlapGroups(events);

  return (
    <>
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="w-full flex flex-col lg:flex-row gap-4">
            {userRole === ADMIN && (
              <CreateEventDialog availableDays={availableDays} start_time={start_time} end_time={end_time} />
            )}
            <Select value={label} onValueChange={(value) => handleSelectDay(value)}>
              <SelectTrigger className="min-w-[165px] lg:w-[165px] w-full">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {availableDays.map((day) => (
                  <SelectItem key={day.label} value={day.label}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={(value) => setCategory(value as CategoryWithAll<EventCategory>)}>
              <SelectTrigger className="min-w-[125px] lg:w-[125px] w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {EVENT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <InputGroup className="lg:max-w-[350px] w-full">
            <InputGroupInput
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="truncate"
              aria-label="Search events"
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div className="w-full flex flex-col py-2">
          {visibleCalendarRows.slice(0, -1).map((calendarRow) => (
            <CalendarRow
              key={calendarRow.label}
              events={events}
              calendarDayStartMs={startMs}
              overlapGroups={overlapGroups}
              {...calendarRow}
              {...useEventDialogReturn}
            />
          ))}
          <div className="w-full grid grid-cols-[50px_1fr] space-x-2">
            <div className="relative text-sm h-full">
              <p className="absolute top-0 m-0 w-full text-right -translate-y-1/2">
                {visibleCalendarRows.at(-1)!.label}
              </p>
            </div>
            <div className="h-full border-t border-dashed" />
          </div>
        </div>
      </div>
      <EventDialog userRole={userRole} {...useEventDialogReturn} />
    </>
  );
};

export default Calendar;
