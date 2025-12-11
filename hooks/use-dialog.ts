"use client";

import { useCallback, useState } from "react";

export type UseDialogReturn<T extends { id: string }> = {
  selectedItem: T | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleSelectItem: (itemId: T["id"]) => void;
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

  return { selectedItem, isOpen, setIsOpen, handleSelectItem };
};
