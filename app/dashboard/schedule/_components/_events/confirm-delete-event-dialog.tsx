"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UseConfirmDeleteDialogReturn } from "@/hooks";

import type { Event } from "../../types";

type ConfirmDeleteEventDialogProps = Pick<
  UseConfirmDeleteDialogReturn<Event>,
  "isDeleting" | "handleDeleteItems" | "isOpen" | "setIsOpen" | "hasMultipleItems"
>;

const ConfirmDeleteDialog = ({
  isDeleting,
  handleDeleteItems,
  isOpen,
  setIsOpen,
  hasMultipleItems,
}: ConfirmDeleteEventDialogProps) => {
  const titleText = hasMultipleItems ? "Confirm delete events" : "Confirm delete event";
  const descriptionText = hasMultipleItems
    ? "Are you sure you want to delete these events? This action cannot be undone."
    : "Are you sure you want to delete this event? This action cannot be undone.";
  const buttonText = hasMultipleItems ? "Delete events" : "Delete event";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titleText}</DialogTitle>
          <DialogDescription>{descriptionText}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isDeleting}>
              Go Back
            </Button>
          </DialogClose>
          <Button variant="destructive" disabled={isDeleting} onClick={handleDeleteItems}>
            {isDeleting ? <Loader2 className="size-4 animate-spin" /> : buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
