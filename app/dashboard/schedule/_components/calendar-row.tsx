"use client";

import { useMemo } from "react";

import { OFFSET, ROW_HEIGHT, ROW_WIDTH_PERCENTAGE } from "@/constants/calendar";
import {
  calculateItemHeight,
  calculateTopPosition,
  findOverlapGroupAnchor,
  getOverlapGroupEvents,
  isStandaloneEvent,
} from "@/lib/calendar";
import { CalendarItemLayout, TimeBlock } from "@/types/calendar";
import Event from "@/types/events";

import CalendarItem from "./calendar-item";

type CalendarRowProps = {
  start: number;
  end: number;
  label: TimeBlock["label"];
  events: Event[];
  overlapGroups: Map<Event["id"], Set<Event["id"]>>;
};

export default function CalendarRow({ start, end, label, events, overlapGroups }: CalendarRowProps) {
  const filteredEvents = events.filter((event) => event.start >= start && event.start < end);

  const eventLayouts = useMemo(() => {
    const layouts: CalendarItemLayout[] = [];
    const slotDuration = end - start;

    for (const event of filteredEvents) {
      const top = calculateTopPosition(event, start, slotDuration);
      const height = calculateItemHeight(event, slotDuration);

      if (isStandaloneEvent(event.id, overlapGroups)) {
        layouts.push({ event, left: 0, top, width: ROW_WIDTH_PERCENTAGE, height });
        continue;
      }

      const anchorId = findOverlapGroupAnchor(event.id, overlapGroups);
      if (!anchorId) {
        layouts.push({ event, left: 0, top, width: ROW_WIDTH_PERCENTAGE, height });
        continue;
      }

      const groupEvents = getOverlapGroupEvents(anchorId, events, overlapGroups);
      const eventsInThisSlot = groupEvents.filter((event) => event.start >= start && event.start < end);

      if (eventsInThisSlot.length > 1) {
        const eventIndex = eventsInThisSlot.findIndex((event) => event.id === event.id);
        const columnWidth = ROW_WIDTH_PERCENTAGE / eventsInThisSlot.length;

        layouts.push({
          event,
          left: eventIndex * columnWidth,
          top,
          width: columnWidth,
          height,
        });
      } else {
        const previousOverlapping = groupEvents
          .filter((event) => event.end > event.start && event.start < event.start)
          .sort((a, b) => b.start - a.start)[0];

        if (previousOverlapping) {
          const left = OFFSET;
          layouts.push({
            event,
            left,
            top,
            width: ROW_WIDTH_PERCENTAGE - left,
            height,
          });
        } else {
          layouts.push({
            event,
            left: 0,
            top,
            width: ROW_WIDTH_PERCENTAGE,
            height,
          });
        }
      }
    }

    return layouts;
  }, [filteredEvents, events, overlapGroups, start, end]);

  return (
    <div className={`w-full h-[${ROW_HEIGHT}px] grid grid-cols-[50px_1fr] space-x-2`}>
      <div className="relative text-sm h-full">
        <p className="absolute top m-0 w-full text-right -translate-y-1/2">{label}</p>
      </div>
      <div className="relative h-full border-t border-dashed">
        {eventLayouts.map((eventLayout) => (
          <CalendarItem key={eventLayout.event.id} {...eventLayout} />
        ))}
      </div>
    </div>
  );
}
