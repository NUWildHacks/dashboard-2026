"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ActionResult } from "@/types";

export type UseConfirmDeleteDialogReturn<T extends { id: string }> = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  hasMultipleItems: boolean;
  isDeleting: boolean;
  selectedItemIds: T["id"][];
  handleOpenConfirmDeleteDialog: (itemIds: T["id"][]) => void;
  handleDeleteItems: () => Promise<void>;
};

export const useConfirmDeleteDialog = <T extends { id: string }>(
  deleteFn: (itemIds: T["id"][]) => Promise<ActionResult>,
  itemName: string
): UseConfirmDeleteDialogReturn<T> => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasMultipleItems, setHasMultipleItems] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<T["id"][]>([]);

  const handleOpenConfirmDeleteDialog = (itemIds: T["id"][]) => {
    setHasMultipleItems(itemIds.length > 1);
    setSelectedItemIds(itemIds);
    setIsOpen(true);
  };

  const handleDeleteItems = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteFn(selectedItemIds);
      const { success } = result;

      if (!success) {
        const { field, error } = result;

        if (!field) {
          throw new Error(error);
        }

        return;
      }

      setIsOpen(false);
      setSelectedItemIds([]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error(`Delete ${itemName} error:`, errorMessage);

      toast.error(`Failed to delete ${itemName}`, { description: errorMessage });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    isDeleting,
    selectedItemIds,
    hasMultipleItems,
    handleOpenConfirmDeleteDialog,
    handleDeleteItems,
  };
};
