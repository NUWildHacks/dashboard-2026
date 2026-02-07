"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ActionResult } from "@/types";

export type UseDialogReturn<T extends { id: string }> = {
  selectedItem: T | null;
  isOpen: boolean;
  isDeleting: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleSelectItem: (itemId: T["id"]) => void;
  handleKeyDown: (event: React.KeyboardEvent, id: T["id"]) => void;
  handleDeleteItem: (deleteFn: (id: string) => Promise<ActionResult<T>>) => Promise<void>;
};

export const useDialog = <T extends { id: string }>(items: T[]): UseDialogReturn<T> => {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleSelectItem = (itemId: T["id"]) => {
    const item = items.find((item) => item.id === itemId);

    if (!item) {
      return;
    }

    setSelectedItem(item);
    setIsOpen(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent, id: T["id"]) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelectItem(id);
    }
  };

  const handleDeleteItem = async (deleteFn: (id: string) => Promise<ActionResult<T>>) => {
    if (!selectedItem) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteFn(selectedItem.id);
      const { success } = result;

      if (!success) {
        const { error } = result;
        throw new Error(error);
      }

      setIsOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error deleting event:", errorMessage);

      toast.error("Failed to delete event", { description: errorMessage });
    } finally {
      setIsDeleting(false);
    }
  };

  return { selectedItem, isOpen, setIsOpen, isDeleting, handleSelectItem, handleDeleteItem, handleKeyDown };
};
