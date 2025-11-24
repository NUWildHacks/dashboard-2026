"use client";

import { useCallback, useState } from "react";

import { Announcement } from "@/types/announcement";

export type UseAnnouncementDialogReturn = {
  selectedAnnouncement: Announcement | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleSelectAnnouncement: (announcementId: Announcement["id"]) => void;
};

export const useAnnoucementDialog = (announcements: Announcement[]): UseAnnouncementDialogReturn => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSelectAnnouncement = useCallback(
    (announcementId: Announcement["id"]) => {
      const announcement = announcements.find((announcement) => announcement.id === announcementId);

      if (!announcement) {
        return;
      }

      setSelectedAnnouncement(announcement);
      setIsOpen(true);
    },
    [announcements]
  );

  return { selectedAnnouncement, isOpen, setIsOpen, handleSelectAnnouncement };
};
