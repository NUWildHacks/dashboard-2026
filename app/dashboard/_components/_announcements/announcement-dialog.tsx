"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { UseAnnouncementDialogReturn } from "../../_hooks/use-announcement-dialog";

type AnnouncementDialogProps = Pick<UseAnnouncementDialogReturn, "isOpen" | "setIsOpen" | "selectedAnnouncement">;

export default function AnnouncementDialog({ isOpen, setIsOpen, selectedAnnouncement }: AnnouncementDialogProps) {
  if (!selectedAnnouncement) {
    return null;
  }

  const { id, category, title, body, author, audience, links } = selectedAnnouncement;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{body}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
