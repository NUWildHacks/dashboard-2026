"use client";

import { useState } from "react";

export type UseItemDialogReturn<T extends { id: string }> = {
  selectedItem: T | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleSelectItem: (itemId: T["id"]) => void;
  handleKeyDown: (event: React.KeyboardEvent, id: T["id"]) => void;
};

export const useItemDialog = <T extends { id: string }>(items: T[]): UseItemDialogReturn<T> => {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

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

  return { selectedItem, isOpen, setIsOpen, handleSelectItem, handleKeyDown };
};
