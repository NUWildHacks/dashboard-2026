"use client";

import { CalendarDays, Table2, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ADMIN } from "@/constants";
import { CategoryWithAll, useItemDialog, useFilters, useWildhacksGlobalSettings } from "@/hooks";
import { User } from "@/types";

import { useEventFormDialog, useEvents, useEventsTable, useScheduleDisplay } from "../_hooks";
import { EVENT_CATEGORIES } from "../constants";
import { EventCategory, Event } from "../types";

import { Calendar, EventDialog, EventFormDialog, EventsTable } from ".";

type ScheduleDisplayProps = {
  userRole: User["role"];
};

const ScheduleDisplay = ({ userRole }: ScheduleDisplayProps) => {
  const { selectedDay, availableDays, handleSelectDay, display, setDisplay } = useScheduleDisplay();
  const { label } = selectedDay;

  const { category, setCategory, search, setSearch } = useFilters<EventCategory>();

  const useEventsReturn = useEvents({ category, search, selectedDay });
  const { events, handleDeleteEvents } = useEventsReturn;

  const useEventDialogReturn = useItemDialog<Event>(events, "event");
  const { handleSelectItem } = useEventDialogReturn;

  const useEventFormDialogReturn = useEventFormDialog(availableDays);
  const { handleOpenEventFormDialog } = useEventFormDialogReturn;

  const useEventsTableReturn = useEventsTable(events, handleSelectItem, handleOpenEventFormDialog, handleDeleteEvents);
  const { selectedEventIds, eventsColumns, table } = useEventsTableReturn;

  return (
    <>
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="w-full flex flex-col lg:flex-row gap-4">
            {userRole === ADMIN && (
              <Button className="w-full md:w-auto" onClick={() => handleOpenEventFormDialog()}>
                Create event
              </Button>
            )}
            {selectedEventIds.length > 0 && display === "table" && userRole === ADMIN && (
              <Button
                variant="destructive"
                onClick={() => handleDeleteEvents(selectedEventIds)}
                className="w-full md:w-auto"
              >
                Delete event(s)
              </Button>
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
            {userRole === ADMIN && (
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
            )}
          </div>
          <InputGroup className="lg:max-w-[350px] w-full">
            <InputGroupInput
              id="search-events"
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
        {display === "calendar" && <Calendar {...selectedDay} {...useEventsReturn} {...useEventDialogReturn} />}
        {display === "table" && userRole === ADMIN && <EventsTable columns={eventsColumns} table={table} />}
      </div>
      <EventDialog userRole={userRole} {...useEventDialogReturn} />
      {userRole === ADMIN && <EventFormDialog availableDays={availableDays} {...useEventFormDialogReturn} />}
    </>
  );
};

export default ScheduleDisplay;
