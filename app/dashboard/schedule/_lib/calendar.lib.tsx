import { JSX } from "react";

import { CalendarItem } from "@/app/dashboard/schedule/_components";
import {
  BASE_Z_INDEX,
  CALENDAR_ROWS,
  DEFAULT_FIRST_CALENDAR_ROW_INDEX,
  DEFAULT_LAST_CALENDAR_ROW_INDEX,
  ROW_HEIGHT,
  ROW_WIDTH_PERCENTAGE,
} from "@/app/dashboard/schedule/_constants/calendar.constants";
import type { CalendarRowConfig, Event } from "@/app/dashboard/schedule/_types";
import { ONE_DAY, ONE_MINUTE } from "@/constants/time.constants";
import { UseDialogReturn } from "@/hooks/use-dialog";

/**
 * Get the start of a day (midnight) in milliseconds for a given timestamp
 */
const getDayStart = (milliseconds: number): number => {
  const date = new Date(milliseconds);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

/**
 * Get the end of a day (next midnight) in milliseconds for a given timestamp
 */
const getDayEnd = (milliseconds: number): number => {
  return getDayStart(milliseconds) + ONE_DAY;
};

/**
 * Convert milliseconds since epoch to minutes within a day (0-1440)
 */
const millisecondsToMinutesInDay = (milliseconds: number, dayStart: number): number => {
  const millisecondsFromDayStart = milliseconds - dayStart;
  return Math.floor(millisecondsFromDayStart / ONE_MINUTE);
};

/**
 * Filter events that occur on a specific day
 */
const filterEventsByDay = (events: Event[], dayStart: number, dayEnd: number): Event[] => {
  return events.filter((event) => event.start_time < dayEnd && event.end_time > dayStart);
};

export const createOverlapGroups = (events: Event[]): Map<Event["id"], Set<Event["id"]>> => {
  const overlapGroups = new Map<Event["id"], Set<Event["id"]>>();

  // Sort events by start time
  const sortedEvents = [...events].sort((a, b) => a.start_time - b.start_time);

  let currentEvent = undefined;
  for (let i = 0; i < sortedEvents.length; i++) {
    const event = sortedEvents[i]!;
    if (!currentEvent || event.start_time >= currentEvent.end_time) {
      currentEvent = event;
      overlapGroups.set(currentEvent.id, new Set<Event["id"]>());

      continue;
    }

    overlapGroups.get(currentEvent.id)?.add(event.id);
  }

  return overlapGroups;
};

export const getVisibleCalendarRows = (events: Event[], dayStart: number): CalendarRowConfig[] => {
  if (events.length === 0)
    return CALENDAR_ROWS.slice(DEFAULT_FIRST_CALENDAR_ROW_INDEX, DEFAULT_LAST_CALENDAR_ROW_INDEX + 1);

  // Convert event times to minutes within the day
  const eventsWithMinutes = events.map((event) => ({
    startMinutes: millisecondsToMinutesInDay(event.start_time, dayStart),
    endMinutes: millisecondsToMinutesInDay(event.end_time, dayStart),
  }));

  // Sort by start time
  eventsWithMinutes.sort((a, b) => a.startMinutes - b.startMinutes);

  const firstEvent = eventsWithMinutes.at(0)!;
  const lastEvent = eventsWithMinutes.at(-1)!;

  const firstVisibleRowIndex = Math.min(
    CALENDAR_ROWS.findIndex(
      (interval) => interval.start <= firstEvent.startMinutes && interval.end > firstEvent.startMinutes
    ),
    DEFAULT_FIRST_CALENDAR_ROW_INDEX
  );
  const lastVisibleRowIndex =
    Math.max(
      CALENDAR_ROWS.findIndex(
        (interval) => interval.start < lastEvent.endMinutes && interval.end >= lastEvent.endMinutes
      ) + 1,
      DEFAULT_LAST_CALENDAR_ROW_INDEX
    ) + 1;

  return CALENDAR_ROWS.slice(firstVisibleRowIndex, lastVisibleRowIndex);
};

const calculateItemHeight = (event: Event, slotDuration: number, dayStart: number): number => {
  const eventStartMinutes = millisecondsToMinutesInDay(event.start_time, dayStart);
  const eventEndMinutes = millisecondsToMinutesInDay(event.end_time, dayStart);
  const eventDurationMinutes = eventEndMinutes - eventStartMinutes;
  const numberOfSlots = eventDurationMinutes / slotDuration;
  return numberOfSlots * ROW_HEIGHT;
};

const calculateTopPosition = (event: Event, start: number, slotDuration: number, dayStart: number): number => {
  const eventStartMinutes = millisecondsToMinutesInDay(event.start_time, dayStart);
  const minutesFromSlotStart = eventStartMinutes - start;
  return (minutesFromSlotStart / slotDuration) * 100;
};

const findOverlapGroupAnchor = (
  eventId: Event["id"],
  overlapGroups: Map<Event["id"], Set<Event["id"]>>
): Event["id"] | null => {
  if (overlapGroups.has(eventId)) return eventId;

  for (const [anchorId, groupSet] of overlapGroups.entries()) {
    if (groupSet.has(eventId)) return anchorId;
  }

  return null;
};

const getOverlapGroupEvents = (
  anchorId: Event["id"],
  events: Event[],
  overlapGroups: Map<Event["id"], Set<Event["id"]>>
): Event[] => {
  const groupEventIds = new Set([anchorId, ...Array.from(overlapGroups.get(anchorId) || [])]);
  return events.filter((e) => groupEventIds.has(e.id));
};

const isStandaloneEvent = (eventId: Event["id"], overlapGroups: Map<Event["id"], Set<Event["id"]>>): boolean => {
  const anchorId = findOverlapGroupAnchor(eventId, overlapGroups);
  if (!anchorId) return true;

  const groupSize = (overlapGroups.get(anchorId)?.size || 0) + 1;
  return groupSize === 1;
};

export const getCalendarItems = (
  events: Event[],
  start: number,
  end: number,
  overlapGroups: Map<Event["id"], Set<Event["id"]>>,
  handleSelectItem: UseDialogReturn<Event>["handleSelectItem"],
  dayStart: number
): JSX.Element[] => {
  const calendarItems: JSX.Element[] = [];
  const slotDuration = end - start;

  // Convert event times to minutes and filter by the calendar row time range
  const filteredEvents = events
    .map((event) => ({
      event,
      startMinutes: millisecondsToMinutesInDay(event.start_time, dayStart),
      endMinutes: millisecondsToMinutesInDay(event.end_time, dayStart),
    }))
    .filter(({ startMinutes }) => startMinutes >= start && startMinutes < end)
    .sort((a, b) => a.startMinutes - b.startMinutes)
    .map(({ event }) => event);

  for (let i = 0; i < filteredEvents.length; i++) {
    const event = filteredEvents[i]!;

    const top = calculateTopPosition(event, start, slotDuration, dayStart);
    const height = calculateItemHeight(event, slotDuration, dayStart);

    let zIndex = BASE_Z_INDEX;
    for (let j = 0; j < i; j++) {
      const previousEvent = filteredEvents[j]!;
      if (previousEvent.start_time < event.end_time && previousEvent.end_time > event.start_time) {
        zIndex++;
      }
    }

    if (isStandaloneEvent(event.id, overlapGroups)) {
      calendarItems.push(
        <CalendarItem
          key={event.id}
          left={0}
          top={top}
          width={ROW_WIDTH_PERCENTAGE}
          height={height}
          zIndex={zIndex}
          handleSelectItem={handleSelectItem}
          {...event}
        />
      );
      continue;
    }

    const anchorId = findOverlapGroupAnchor(event.id, overlapGroups);
    if (!anchorId) {
      calendarItems.push(
        <CalendarItem
          key={event.id}
          left={0}
          top={top}
          width={ROW_WIDTH_PERCENTAGE}
          height={height}
          zIndex={zIndex}
          handleSelectItem={handleSelectItem}
          {...event}
        />
      );
      continue;
    }

    // Get ALL events in the overlap group
    const groupEvents = getOverlapGroupEvents(anchorId, events, overlapGroups);

    // Find the index of the current event within the group (based on start time)
    const eventIndexInGroup = groupEvents.findIndex((e) => e.id === event.id);

    // Width is based on the TOTAL number of events in the group
    const columnWidth = ROW_WIDTH_PERCENTAGE / groupEvents.length;

    calendarItems.push(
      <CalendarItem
        key={event.id}
        left={eventIndexInGroup * columnWidth}
        top={top}
        width={columnWidth}
        height={height}
        zIndex={zIndex}
        handleSelectItem={handleSelectItem}
        {...event}
      />
    );
  }

  return calendarItems;
};

// Export helper functions for use in calendar component
export { filterEventsByDay, getDayStart, getDayEnd };
