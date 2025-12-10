import { ROW_HEIGHT } from "@/constants/calendar";
import Event from "@/types/events";

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
