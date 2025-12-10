import {
  BASE_Z_INDEX,
  CALENDAR_ROW_INTERVALS,
  DEFAULT_FIRST_CALENDAR_ROW_INTERVAL_INDEX,
  DEFAULT_LAST_CALENDAR_ROW_INTERVAL_INDEX,
  OFFSET_PERCENTAGE,
  ROW_HEIGHT,
  ROW_WIDTH_PERCENTAGE,
} from "@/constants/calendar";
import { CalendarItemLayout, CalendarRowInterval } from "@/types/calendar";
import Event from "@/types/events";

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

export const getVisibleRowIntervals = (events: Event[]): CalendarRowInterval[] => {
  if (events.length === 0)
    return CALENDAR_ROW_INTERVALS.slice(
      DEFAULT_FIRST_CALENDAR_ROW_INTERVAL_INDEX,
      DEFAULT_LAST_CALENDAR_ROW_INTERVAL_INDEX + 1
    );

  const firstEvent = events.at(0)!;
  const lastEvent = events.at(-1)!;

  const firstVisibleRowIntervalIndex = Math.min(
    CALENDAR_ROW_INTERVALS.findIndex(
      (interval) => interval.start <= firstEvent.start && interval.end > firstEvent.start
    ),
    DEFAULT_FIRST_CALENDAR_ROW_INTERVAL_INDEX
  );
  const lastVisibleRowIntervalIndex =
    Math.max(
      CALENDAR_ROW_INTERVALS.findIndex((interval) => interval.start <= lastEvent.end && interval.end > lastEvent.end),
      DEFAULT_LAST_CALENDAR_ROW_INTERVAL_INDEX
    ) + 1;

  return CALENDAR_ROW_INTERVALS.slice(firstVisibleRowIntervalIndex, lastVisibleRowIntervalIndex);
};

export const calculateItemHeight = (event: Event, slotDuration: number): number => {
  const eventDuration = event.end - event.start;
  const numberOfSlots = eventDuration / slotDuration;
  return numberOfSlots * ROW_HEIGHT;
};

export const calculateTopPosition = (event: Event, start: number, slotDuration: number): number => {
  const minutesFromSlotStart = event.start - start;
  return (minutesFromSlotStart / slotDuration) * 100;
};

export const findOverlapGroupAnchor = (
  eventId: Event["id"],
  overlapGroups: Map<Event["id"], Set<Event["id"]>>
): Event["id"] | null => {
  if (overlapGroups.has(eventId)) return eventId;

  for (const [anchorId, groupSet] of overlapGroups.entries()) {
    if (groupSet.has(eventId)) return anchorId;
  }

  return null;
};

export const getOverlapGroupEvents = (
  anchorId: Event["id"],
  events: Event[],
  overlapGroups: Map<Event["id"], Set<Event["id"]>>
): Event[] => {
  const groupEventIds = new Set([anchorId, ...Array.from(overlapGroups.get(anchorId) || [])]);
  return events.filter((e) => groupEventIds.has(e.id));
};

export const isStandaloneEvent = (eventId: Event["id"], overlapGroups: Map<Event["id"], Set<Event["id"]>>): boolean => {
  const anchorId = findOverlapGroupAnchor(eventId, overlapGroups);
  if (!anchorId) return true;

  const groupSize = (overlapGroups.get(anchorId)?.size || 0) + 1;
  return groupSize === 1;
};

export const getEventLayouts = (
  filteredEvents: Event[],
  events: Event[],
  start: number,
  end: number,
  overlapGroups: Map<Event["id"], Set<Event["id"]>>
): CalendarItemLayout[] => {
  const layouts: CalendarItemLayout[] = [];
  const slotDuration = end - start;

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
      layouts.push({ event, left: 0, top, width: ROW_WIDTH_PERCENTAGE, height, zIndex });
      continue;
    }

    const anchorId = findOverlapGroupAnchor(event.id, overlapGroups);
    if (!anchorId) {
      layouts.push({ event, left: 0, top, width: ROW_WIDTH_PERCENTAGE, height, zIndex });
      continue;
    }

    const groupEvents = getOverlapGroupEvents(anchorId, events, overlapGroups);
    const eventsInThisSlot = groupEvents.filter((event) => event.start >= start && event.start < end);

    if (eventsInThisSlot.length > 1) {
      const eventIndex = eventsInThisSlot.findIndex((e) => e.id === event.id);
      const columnWidth = ROW_WIDTH_PERCENTAGE / eventsInThisSlot.length;

      layouts.push({
        event,
        left: eventIndex * columnWidth,
        top,
        width: columnWidth,
        height,
        zIndex,
      });
    } else {
      const previousOverlapping = groupEvents
        .filter((e) => e.end > event.start && e.start < event.start)
        .sort((a, b) => b.start - a.start)[0];

      if (previousOverlapping) {
        layouts.push({
          event,
          left: OFFSET_PERCENTAGE,
          top,
          width: ROW_WIDTH_PERCENTAGE - OFFSET_PERCENTAGE,
          height,
          zIndex,
        });
      } else {
        layouts.push({
          event,
          left: 0,
          top,
          width: ROW_WIDTH_PERCENTAGE,
          height,
          zIndex,
        });
      }
    }
  }

  return layouts;
};
