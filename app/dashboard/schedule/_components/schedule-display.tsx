"use client";

import { CalendarDays, Table2, SearchIcon } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ADMIN } from "@/constants";
import { CategoryWithAll, useDialog, useFilters } from "@/hooks";
import { User, WildHacksConfig } from "@/types";

import { useEvents, useScheduleDisplay } from "../_hooks";
import { EVENT_CATEGORIES } from "../constants";
import { EventCategory, Event } from "../types";

import { Calendar, CreateEventDialog, EventDialog, EventsTable } from ".";

type ScheduleDisplayProps = {
  userRole: User["role"];
} & Pick<WildHacksConfig, "start_time" | "end_time">;

const ScheduleDisplay = ({ userRole, start_time, end_time }: ScheduleDisplayProps) => {
  const { category, setCategory, search, setSearch } = useFilters<EventCategory>();

  const { selectedDay, availableDays, handleSelectDay, display, setDisplay } = useScheduleDisplay(start_time, end_time);
  const { label } = selectedDay;

  const useEventsReturn = useEvents({ category, search, selectedDay });
  const { events } = useEventsReturn;

  const useEventDialogReturn = useDialog<Event>(events);

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
            <Tabs value={display} onValueChange={(value) => setDisplay(value as "calendar" | "table")}>
              <TabsList className="w-full lg:w-fit">
                <TabsTrigger value="calendar">
                  <CalendarDays />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="table">
                  <Table2 />
                  Table
                </TabsTrigger>
              </TabsList>
            </Tabs>
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
        {display === "calendar" && (
          <Calendar
            start_time={start_time}
            end_time={end_time}
            {...selectedDay}
            {...useEventsReturn}
            {...useEventDialogReturn}
          />
        )}
        {display === "table" && <EventsTable {...useEventsReturn} {...useEventDialogReturn} />}
      </div>
      <EventDialog userRole={userRole} {...useEventDialogReturn} />
    </>
  );
};

export default ScheduleDisplay;
