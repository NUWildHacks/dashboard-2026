import { JSX } from "react";

import { CalendarItem } from "@/app/dashboard/schedule/_components";
import {
  BASE_Z_INDEX,
  CALENDAR_ROWS,
  DEFAULT_FIRST_CALENDAR_ROW_INDEX,
  DEFAULT_LAST_CALENDAR_ROW_INDEX,
  ROW_HEIGHT,
  ROW_WIDTH_PERCENTAGE,
} from "@/app/dashboard/schedule/_constants";
import type { CalendarRowConfig, Event } from "@/app/dashboard/schedule/_types";
import { ONE_DAY, ONE_MINUTE } from "@/constants";
import type { UseDialogReturn } from "@/hooks";

/**
 * Get the start of a day (midnight) in milliseconds for a given timestamp.
 *
 * @param milliseconds - Timestamp in milliseconds since epoch
 * @returns The start of the day (midnight) in milliseconds since epoch
 * @example
 * ```ts
 * const timestamp = new Date('2026-04-11T14:30:00').getTime(); // 2:30 PM
 * const dayStart = getDayStart(timestamp); // Returns midnight (00:00:00) of April 11, 2026
 * ```
 */
const getDayStart = (milliseconds: number): number => {
  const date = new Date(milliseconds);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

/**
 * Get the end of a day (next midnight) in milliseconds for a given timestamp.
 *
 * @param milliseconds - Timestamp in milliseconds since epoch
 * @returns The end of the day (next midnight) in milliseconds since epoch
 * @example
 * ```ts
 * const timestamp = new Date('2026-04-11T14:30:00').getTime(); // 2:30 PM
 * const dayEnd = getDayEnd(timestamp); // Returns midnight (00:00:00) of April 12, 2026
 * ```
 */
const getDayEnd = (milliseconds: number): number => {
  return getDayStart(milliseconds) + ONE_DAY;
};

/**
 * Convert milliseconds since epoch to minutes within a day (0-1440).
 *
 * @param milliseconds - Timestamp in milliseconds since epoch
 * @param dayStart - The start of the day in milliseconds since epoch
 * @returns Minutes from the start of the day (0-1440)
 * @example
 * ```ts
 * const dayStart = new Date('2026-04-11T00:00:00').getTime();
 * const eventTime = new Date('2026-04-11T14:30:00').getTime(); // 2:30 PM
 * const minutes = millisecondsToMinutesInDay(eventTime, dayStart); // Returns 870 (14 * 60 + 30)
 * ```
 */
const millisecondsToMinutesInDay = (milliseconds: number, dayStart: number): number => {
  const millisecondsFromDayStart = milliseconds - dayStart;
  return Math.floor(millisecondsFromDayStart / ONE_MINUTE);
};

/**
 * Filter events that occur on a specific day.
 * An event is considered to occur on a day if it overlaps with the day's time range.
 *
 * @param events - Array of events to filter
 * @param dayStart - The start of the day in milliseconds since epoch
 * @param dayEnd - The end of the day in milliseconds since epoch
 * @returns Array of events that occur on the specified day
 * @example
 * ```ts
 * const events = [
 *   { id: '1', start_time: new Date('2026-04-11T10:00:00').getTime(), end_time: new Date('2026-04-11T11:00:00').getTime() },
 *   { id: '2', start_time: new Date('2026-04-12T10:00:00').getTime(), end_time: new Date('2026-04-12T11:00:00').getTime() },
 * ];
 * const dayStart = new Date('2026-04-11T00:00:00').getTime();
 * const dayEnd = new Date('2026-04-12T00:00:00').getTime();
 * const filtered = filterEventsByDay(events, dayStart, dayEnd); // Returns only event with id '1'
 * ```
 */
const filterEventsByDay = (events: Event[], dayStart: number, dayEnd: number): Event[] => {
  return events.filter((event) => event.start_time < dayEnd && event.end_time > dayStart);
};

/**
 * Create overlap groups for events that occur at the same time.
 * Events that overlap in time are grouped together, with the first event in each group
 * serving as the anchor. This is used to determine how to display overlapping events
 * side-by-side in the calendar.
 *
 * @param events - Array of events to analyze for overlaps
 * @returns Map where keys are anchor event IDs and values are sets of overlapping event IDs
 * @example
 * ```ts
 * const events = [
 *   { id: '1', start_time: 1000, end_time: 2000 },
 *   { id: '2', start_time: 1500, end_time: 2500 }, // Overlaps with event 1
 *   { id: '3', start_time: 3000, end_time: 4000 }, // No overlap
 * ];
 * const groups = createOverlapGroups(events);
 * // Returns: Map { '1' => Set(['2']), '3' => Set() }
 * ```
 */
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

/**
 * Get the visible calendar rows based on the events for a given day.
 * Determines which time slots (rows) should be displayed based on when events start and end.
 * Returns a subset of CALENDAR_ROWS that includes all events, with a minimum default range.
 *
 * @param events - Array of events for the selected day
 * @param dayStart - The start of the day in milliseconds since epoch
 * @returns Array of calendar row configurations to display
 * @example
 * ```ts
 * const events = [
 *   { id: '1', start_time: new Date('2026-04-11T09:00:00').getTime(), end_time: new Date('2026-04-11T10:00:00').getTime() },
 *   { id: '2', start_time: new Date('2026-04-11T15:00:00').getTime(), end_time: new Date('2026-04-11T16:00:00').getTime() },
 * ];
 * const dayStart = new Date('2026-04-11T00:00:00').getTime();
 * const rows = getVisibleCalendarRows(events, dayStart);
 * // Returns calendar rows from 9 AM to 4 PM (or default range if wider)
 * ```
 */
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

/**
 * Calculate the height of a calendar item in pixels based on event duration.
 *
 * @param event - The event to calculate height for
 * @param slotDuration - Duration of the calendar row slot in minutes
 * @param dayStart - The start of the day in milliseconds since epoch
 * @returns Height of the calendar item in pixels
 * @example
 * ```ts
 * const event = {
 *   start_time: new Date('2026-04-11T09:00:00').getTime(),
 *   end_time: new Date('2026-04-11T10:30:00').getTime(), // 90 minutes
 * };
 * const slotDuration = 60; // 1 hour row
 * const dayStart = new Date('2026-04-11T00:00:00').getTime();
 * const height = calculateItemHeight(event, slotDuration, dayStart);
 * // Returns: (90 / 60) * ROW_HEIGHT = 1.5 * ROW_HEIGHT pixels
 * ```
 */
const calculateItemHeight = (event: Event, slotDuration: number, dayStart: number): number => {
  const eventStartMinutes = millisecondsToMinutesInDay(event.start_time, dayStart);
  const eventEndMinutes = millisecondsToMinutesInDay(event.end_time, dayStart);
  const eventDurationMinutes = eventEndMinutes - eventStartMinutes;
  const numberOfSlots = eventDurationMinutes / slotDuration;
  return numberOfSlots * ROW_HEIGHT;
};

/**
 * Calculate the top position (as a percentage) of a calendar item within a row.
 *
 * @param event - The event to calculate position for
 * @param start - Start time of the calendar row in minutes (0-1440)
 * @param slotDuration - Duration of the calendar row slot in minutes
 * @param dayStart - The start of the day in milliseconds since epoch
 * @returns Top position as a percentage (0-100)
 * @example
 * ```ts
 * const event = { start_time: new Date('2026-04-11T09:15:00').getTime() };
 * const rowStart = 540; // 9:00 AM in minutes
 * const slotDuration = 60; // 1 hour row
 * const dayStart = new Date('2026-04-11T00:00:00').getTime();
 * const top = calculateTopPosition(event, rowStart, slotDuration, dayStart);
 * // Returns: (15 / 60) * 100 = 25% (event starts 15 minutes into the hour)
 * ```
 */
const calculateTopPosition = (event: Event, start: number, slotDuration: number, dayStart: number): number => {
  const eventStartMinutes = millisecondsToMinutesInDay(event.start_time, dayStart);
  const minutesFromSlotStart = eventStartMinutes - start;
  return (minutesFromSlotStart / slotDuration) * 100;
};

/**
 * Find the anchor event ID for a given event in an overlap group.
 * The anchor is the first event in a group of overlapping events.
 *
 * @param eventId - The ID of the event to find the anchor for
 * @param overlapGroups - Map of overlap groups from createOverlapGroups
 * @returns The anchor event ID if found, null otherwise
 * @example
 * ```ts
 * const overlapGroups = new Map([
 *   ['1', new Set(['2', '3'])], // Event 1 is anchor, events 2 and 3 overlap with it
 * ]);
 * const anchor1 = findOverlapGroupAnchor('1', overlapGroups); // Returns '1'
 * const anchor2 = findOverlapGroupAnchor('2', overlapGroups); // Returns '1' (anchor of group)
 * const anchor4 = findOverlapGroupAnchor('4', overlapGroups); // Returns null (not in any group)
 * ```
 */
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

/**
 * Get all events in an overlap group, including the anchor event.
 *
 * @param anchorId - The ID of the anchor event for the group
 * @param events - Array of all events
 * @param overlapGroups - Map of overlap groups from createOverlapGroups
 * @returns Array of all events in the overlap group
 * @example
 * ```ts
 * const events = [
 *   { id: '1', start_time: 1000, end_time: 2000 },
 *   { id: '2', start_time: 1500, end_time: 2500 },
 *   { id: '3', start_time: 1800, end_time: 2800 },
 * ];
 * const overlapGroups = new Map([['1', new Set(['2', '3'])]]);
 * const groupEvents = getOverlapGroupEvents('1', events, overlapGroups);
 * // Returns: [{ id: '1' }, { id: '2' }, { id: '3' }]
 * ```
 */
const getOverlapGroupEvents = (
  anchorId: Event["id"],
  events: Event[],
  overlapGroups: Map<Event["id"], Set<Event["id"]>>
): Event[] => {
  const groupEventIds = new Set([anchorId, ...Array.from(overlapGroups.get(anchorId) || [])]);
  return events.filter((e) => groupEventIds.has(e.id));
};

/**
 * Check if an event is standalone (not part of an overlap group).
 *
 * @param eventId - The ID of the event to check
 * @param overlapGroups - Map of overlap groups from createOverlapGroups
 * @returns True if the event is standalone, false if it's part of an overlap group
 * @example
 * ```ts
 * const overlapGroups = new Map([
 *   ['1', new Set(['2'])], // Event 1 has overlapping event 2
 * ]);
 * const isStandalone1 = isStandaloneEvent('1', overlapGroups); // Returns false (has overlap)
 * const isStandalone3 = isStandaloneEvent('3', overlapGroups); // Returns true (no overlap)
 * ```
 */
const isStandaloneEvent = (eventId: Event["id"], overlapGroups: Map<Event["id"], Set<Event["id"]>>): boolean => {
  const anchorId = findOverlapGroupAnchor(eventId, overlapGroups);
  if (!anchorId) return true;

  const groupSize = (overlapGroups.get(anchorId)?.size || 0) + 1;
  return groupSize === 1;
};

/**
 * Generate calendar item components for a specific time range (row).
 * Handles positioning, sizing, and overlap grouping of events within a calendar row.
 * Events that overlap are displayed side-by-side with proportional widths.
 *
 * @param events - Array of events to display
 * @param start - Start time of the calendar row in minutes (0-1440)
 * @param end - End time of the calendar row in minutes (0-1440)
 * @param overlapGroups - Map of overlap groups from createOverlapGroups
 * @param handleSelectItem - Callback function to handle event selection
 * @param dayStart - The start of the day in milliseconds since epoch
 * @returns Array of JSX elements representing calendar items
 * @example
 * ```ts
 * const events = [
 *   { id: '1', start_time: new Date('2026-04-11T09:00:00').getTime(), end_time: new Date('2026-04-11T10:00:00').getTime() },
 *   { id: '2', start_time: new Date('2026-04-11T09:30:00').getTime(), end_time: new Date('2026-04-11T10:30:00').getTime() },
 * ];
 * const overlapGroups = new Map([['1', new Set(['2'])]]);
 * const rowStart = 540; // 9:00 AM
 * const rowEnd = 600; // 10:00 AM
 * const dayStart = new Date('2026-04-11T00:00:00').getTime();
 * const items = getCalendarItems(events, rowStart, rowEnd, overlapGroups, handleSelect, dayStart);
 * // Returns array of CalendarItem components positioned side-by-side (50% width each)
 * ```
 */
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
