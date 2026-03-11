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

import { UseConfirmDeleteDialogReturn } from "../../_hooks";

type ConfirmDeleteDialogProps = Pick<
  UseConfirmDeleteDialogReturn,
  "isDeleting" | "handleDeleteEvents" | "isOpen" | "setIsOpen" | "hasMultipleEvents"
>;

const ConfirmDeleteDialog = ({
  isDeleting,
  handleDeleteEvents,
  isOpen,
  setIsOpen,
  hasMultipleEvents,
}: ConfirmDeleteDialogProps) => {
  const titleText = hasMultipleEvents ? "Confirm delete events" : "Confirm delete event";
  const descriptionText = hasMultipleEvents
    ? "Are you sure you want to delete these events? This action cannot be undone."
    : "Are you sure you want to delete this event? This action cannot be undone.";
  const buttonText = hasMultipleEvents ? "Delete events" : "Delete event";

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
          <Button variant="destructive" disabled={isDeleting} onClick={handleDeleteEvents}>
            {isDeleting ? <Loader2 className="size-4 animate-spin" /> : buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
