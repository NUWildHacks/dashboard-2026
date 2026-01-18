"use client";

import { useCallback, useState } from "react";

export type UseDialogReturn<T extends { id: string }> = {
  selectedItem: T | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleSelectItem: (itemId: T["id"]) => void;
  handleKeyDown: (event: React.KeyboardEvent, id: T["id"]) => void;
};

export const useDialog = <T extends { id: string }>(items: T[]): UseDialogReturn<T> => {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSelectItem = useCallback(
    (itemId: T["id"]) => {
      const item = items.find((item) => item.id === itemId);

      if (!item) {
        return;
      }

      setSelectedItem(item);
      setIsOpen(true);
    },
    [items]
  );

  const handleKeyDown = (event: React.KeyboardEvent, id: T["id"]) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelectItem(id);
    }
  };

  return { selectedItem, isOpen, setIsOpen, handleSelectItem, handleKeyDown };
};
