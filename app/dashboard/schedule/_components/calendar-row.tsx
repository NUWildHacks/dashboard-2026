"use client";

import { useMemo } from "react";

import { BASE_Z_INDEX, OFFSET_PERCENTAGE, ROW_HEIGHT, ROW_WIDTH_PERCENTAGE } from "@/constants/calendar";
import {
  calculateItemHeight,
  calculateTopPosition,
  findOverlapGroupAnchor,
  getOverlapGroupEvents,
  isStandaloneEvent,
} from "@/lib/calendar";
import { CalendarItemLayout, TimeBlock } from "@/types/calendar";
import Event from "@/types/events";

import { UseEventDialogReturn } from "../../_hooks/use-event-dialog";

import CalendarItem from "./calendar-item";

type CalendarRowProps = {
  start: number;
  end: number;
  label: TimeBlock["label"];
  events: Event[];
  overlapGroups: Map<Event["id"], Set<Event["id"]>>;
} & Pick<UseEventDialogReturn, "handleSelectEvent">;

export default function CalendarRow({ start, end, label, events, overlapGroups, handleSelectEvent }: CalendarRowProps) {
  const filteredEvents = events.filter((event) => event.start >= start && event.start < end);

  const eventLayouts = useMemo(() => {
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
  }, [filteredEvents, events, overlapGroups, start, end]);

  return (
    <div className={`w-full h-[${ROW_HEIGHT}px] grid grid-cols-[50px_1fr] space-x-2`}>
      <div className="relative text-sm h-full">
        <p className="absolute top m-0 w-full text-right -translate-y-1/2">{label}</p>
      </div>
      <div className="relative h-full border-t border-dashed">
        {eventLayouts.map((eventLayout) => (
          <CalendarItem key={eventLayout.event.id} {...eventLayout} handleSelectEvent={handleSelectEvent} />
        ))}
      </div>
    </div>
  );
}
