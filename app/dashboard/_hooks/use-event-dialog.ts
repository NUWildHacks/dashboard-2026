"use client";

import { useCallback, useState } from "react";

import Event from "@/types/events";

export type UseEventDialogReturn = {
  selectedEvent: Event | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleSelectEvent: (eventId: Event["id"]) => void;
};

export const useEventDialog = (events: Event[]): UseEventDialogReturn => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSelectEvent = useCallback(
    (eventId: Event["id"]) => {
      const event = events.find((event) => event.id === eventId);

      if (!event) {
        return;
      }

      setSelectedEvent(event);
      setIsOpen(true);
    },
    [events]
  );

  return { selectedEvent, isOpen, setIsOpen, handleSelectEvent };
};
