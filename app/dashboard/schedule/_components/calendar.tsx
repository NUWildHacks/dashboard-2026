"use client";

import { useMemo } from "react";

import { CALENDAR_HOURS } from "@/constants/calendar";
import Event from "@/types/events";

import EventDialog from "../../_components/_events/event-dialog";
import { useEventDialog } from "../../_hooks/use-event-dialog";
import { useEvents } from "../../_hooks/use-events";

import CalendarRow from "./calendar-row";

export default function Calendar() {
  const useEventsReturn = useEvents({ limitCount: undefined });
  const { events } = useEventsReturn;

  const useEventDialogReturn = useEventDialog(events);

  const overlapGroups = useMemo(() => {
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
  }, [events]);

  return (
    <>
      <div className="w-full flex flex-col py-2">
        {CALENDAR_HOURS.slice(0, -1).map(({ start, label }, index) => {
          const end = CALENDAR_HOURS[index + 1]!.start;

          return (
            <CalendarRow
              key={`${label}-${start}`}
              start={start}
              end={end}
              label={label}
              events={events}
              overlapGroups={overlapGroups}
              {...useEventDialogReturn}
            />
          );
        })}
        <div className="w-full grid grid-cols-[50px_1fr] space-x-2">
          <div className="relative text-sm h-full">
            <p className="absolute top-0 m-0 w-full text-right -translate-y-1/2">{CALENDAR_HOURS.at(-1)!.label}</p>
          </div>
          <div className="h-full border-t border-dashed" />
        </div>
      </div>
      <EventDialog {...useEventDialogReturn} />
    </>
  );
}
