"use client";

import { SearchIcon } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EVENT_CATEGORIES } from "@/constants/event";
import { createOverlapGroups, getVisibleRowIntervals } from "@/lib/calendar";
import Event, { EventCategory } from "@/types/events";

import EventDialog from "../../_components/_events/event-dialog";
import { useDialog } from "../../_hooks/use-dialog";
import { useEvents } from "../../_hooks/use-events";
import { CategoryWithAll, useFilters } from "../../_hooks/use-filters";

import CalendarRow from "./calendar-row";

const Calendar = () => {
  const { category, setCategory, search, setSearch } = useFilters<EventCategory>();

  const useEventsReturn = useEvents({ category, search });
  const { events } = useEventsReturn;

  const useEventDialogReturn = useDialog<Event>(events);

  const overlapGroups = createOverlapGroups(events);

  const visibleRowIntervals = getVisibleRowIntervals(events);

  return (
    <>
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Tabs value={category} onValueChange={(value) => setCategory(value as CategoryWithAll<EventCategory>)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              {EVENT_CATEGORIES.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <InputGroup className="max-w-[350px]">
            <InputGroupInput
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="truncate"
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>
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
              <p className="absolute top-0 m-0 w-full text-right -translate-y-1/2">
                {visibleRowIntervals.at(-1)!.label}
              </p>
            </div>
            <div className="h-full border-t border-dashed" />
          </div>
        </div>
      </div>
      <EventDialog {...useEventDialogReturn} />
    </>
  );
};

export default Calendar;
