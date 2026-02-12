"use client";

import { SearchIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { CalendarRow, CreateEventDialog, EventDialog } from "@/app/dashboard/schedule/_components";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ADMIN, ONE_DAY } from "@/constants";
import { CategoryWithAll, useDialog, useFilters } from "@/hooks";
import { getDateFromMilliseconds } from "@/lib";
import type { User, WildHacksConfig } from "@/types";

import { useEvents } from "../../_hooks";
import { EVENT_CATEGORIES } from "../../constants";
import { createOverlapGroups, filterEventsByDay, getDayStart, getVisibleCalendarRows } from "../../lib";
import type { Event, EventCategory } from "../../types";

type CalendarProps = {
  userRole: User["role"];
} & Pick<WildHacksConfig, "start_time" | "end_time">;

const Calendar = ({ start_time, end_time, userRole }: CalendarProps) => {
  const { category, setCategory, search, setSearch } = useFilters<EventCategory>();

  const useEventsReturn = useEvents({ category, search });
  const { allEvents } = useEventsReturn;

  const availableDays = useMemo(() => {
    const days: { dayStart: number; dayEnd: number; label: string }[] = [];
    let currentDayStart = getDayStart(start_time);

    while (currentDayStart < end_time) {
      const dayEnd = currentDayStart + ONE_DAY;
      const dayLabel = getDateFromMilliseconds(currentDayStart);
      days.push({ dayStart: currentDayStart, dayEnd, label: dayLabel });
      currentDayStart = dayEnd;
    }

    return days;
  }, [start_time, end_time]);

  const defaultSelectedDay = useMemo(() => {
    const now = new Date().getTime();
    const todayStart = getDayStart(now);

    const todayInRange = availableDays.some((day) => day.dayStart <= todayStart && day.dayEnd > todayStart);

    if (todayInRange) {
      return todayStart;
    }

    return availableDays[0]?.dayStart ?? start_time;
  }, [availableDays, start_time]);

  const [selectedDayStart, setSelectedDayStart] = useState<number>(() => defaultSelectedDay);

  useEffect(() => {
    setSelectedDayStart(defaultSelectedDay);
  }, [defaultSelectedDay]);

  const selectedDay = availableDays.find((day) => day.dayStart === selectedDayStart);
  const dayStart = selectedDay?.dayStart ?? defaultSelectedDay;
  const dayEnd = selectedDay?.dayEnd ?? defaultSelectedDay + ONE_DAY;

  const filteredEvents = useMemo(() => filterEventsByDay(allEvents, dayStart, dayEnd), [allEvents, dayStart, dayEnd]);

  const useEventDialogReturn = useDialog<Event>(filteredEvents);

  const overlapGroups = createOverlapGroups(filteredEvents);

  const visibleCalendarRows = getVisibleCalendarRows(filteredEvents, dayStart);

  return (
    <>
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="w-full flex flex-col lg:flex-row gap-4">
            {userRole === ADMIN && (
              <CreateEventDialog availableDays={availableDays} start_time={start_time} end_time={end_time} />
            )}
            <Select value={selectedDayStart.toString()} onValueChange={(value) => setSelectedDayStart(Number(value))}>
              <SelectTrigger className="min-w-[165px] lg:w-[165px] w-full">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {availableDays.map((day) => (
                  <SelectItem key={day.dayStart} value={day.dayStart.toString()}>
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
              events={filteredEvents}
              overlapGroups={overlapGroups}
              dayStart={dayStart}
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
