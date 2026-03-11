"use client";

import { useState } from "react";
import { toast } from "sonner";

import { deleteEvents } from "../_actions";
import { Event } from "../types";

export type UseConfirmDeleteDialogReturn = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  hasMultipleEvents: boolean;
  isDeleting: boolean;
  handleOpenConfirmDeleteDialog: (eventIds: Event["id"][]) => void;
  handleDeleteEvents: () => Promise<void>;
};

export const useConfirmDeleteDialog = (): UseConfirmDeleteDialogReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasMultipleEvents, setHasMultipleEvents] = useState(false);
  const [selectedEventIds, setSelectedEventIds] = useState<Event["id"][]>([]);

  const handleOpenConfirmDeleteDialog = (eventIds: Event["id"][]) => {
    setHasMultipleEvents(eventIds.length > 1);
    setSelectedEventIds(eventIds);
    setIsOpen(true);
  };

  const handleDeleteEvents = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteEvents(selectedEventIds);
      const { success } = result;

      if (!success) {
        const { field, error } = result;

        if (!field) {
          throw new Error(error);
        }

        return;
      }

      setIsOpen(false);
      setSelectedEventIds([]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Delete events error:", errorMessage);

      toast.error("Failed to delete events", { description: errorMessage });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    isDeleting,
    hasMultipleEvents,
    handleOpenConfirmDeleteDialog,
    handleDeleteEvents,
  };
};
