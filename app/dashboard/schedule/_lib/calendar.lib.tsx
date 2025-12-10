import { JSX } from "react";

import { UseDialogReturn } from "@/app/dashboard/_hooks/use-dialog";
import Event from "@/app/dashboard/_types/event.type";
import CalendarItem from "@/app/dashboard/schedule/_components/calendar-item";
import {
  BASE_Z_INDEX,
  CALENDAR_ROWS,
  DEFAULT_FIRST_CALENDAR_ROW_INDEX,
  DEFAULT_LAST_CALENDAR_ROW_INDEX,
  ROW_HEIGHT,
  ROW_WIDTH_PERCENTAGE,
} from "@/app/dashboard/schedule/_constants/calendar.constant";
import { CalendarRow } from "@/app/dashboard/schedule/_types/calendar.type";

export const createOverlapGroups = (events: Event[]): Map<Event["id"], Set<Event["id"]>> => {
  const overlapGroups = new Map<Event["id"], Set<Event["id"]>>();

  let currentEvent = undefined;
  for (let i = 0; i < events.length; i++) {
    if (!currentEvent || events[i].start >= currentEvent.end) {
      currentEvent = events[i];
      overlapGroups.set(currentEvent.id, new Set<Event["id"]>());

      continue;
    }

    overlapGroups.get(currentEvent.id)?.add(events[i].id);
  }

  return overlapGroups;
};

export const getVisibleCalendarRows = (events: Event[]): CalendarRow[] => {
  if (events.length === 0)
    return CALENDAR_ROWS.slice(DEFAULT_FIRST_CALENDAR_ROW_INDEX, DEFAULT_LAST_CALENDAR_ROW_INDEX + 1);

  const firstEvent = events.at(0)!;
  const lastEvent = events.at(-1)!;

  const firstVisibleRowIndex = Math.min(
    CALENDAR_ROWS.findIndex((interval) => interval.start <= firstEvent.start && interval.end > firstEvent.start),
    DEFAULT_FIRST_CALENDAR_ROW_INDEX
  );
  const lastVisibleRowIndex =
    Math.max(
      CALENDAR_ROWS.findIndex((interval) => interval.start < lastEvent.end && interval.end >= lastEvent.end) + 1,
      DEFAULT_LAST_CALENDAR_ROW_INDEX
    ) + 1;

  return CALENDAR_ROWS.slice(firstVisibleRowIndex, lastVisibleRowIndex);
};

const calculateItemHeight = (event: Event, slotDuration: number): number => {
  const eventDuration = event.end - event.start;
  const numberOfSlots = eventDuration / slotDuration;
  return numberOfSlots * ROW_HEIGHT;
};

const calculateTopPosition = (event: Event, start: number, slotDuration: number): number => {
  const minutesFromSlotStart = event.start - start;
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
  handleSelectItem: UseDialogReturn<Event>["handleSelectItem"]
): JSX.Element[] => {
  const calendarItems: JSX.Element[] = [];
  const slotDuration = end - start;

  const filteredEvents = events.filter((event) => event.start >= start && event.start < end);

  for (let i = 0; i < filteredEvents.length; i++) {
    const event = filteredEvents[i]!;

    const top = calculateTopPosition(event, start, slotDuration);
    const height = calculateItemHeight(event, slotDuration);

    let zIndex = BASE_Z_INDEX;
    for (let j = 0; j < i; j++) {
      const previousEvent = filteredEvents[j]!;
      if (previousEvent.start < event.end && previousEvent.end > event.start) {
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
