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

import type { PermissionCode } from "../../types";

type ConfirmDeletePermissionCodesDialogProps = Pick<
  UseConfirmDeleteDialogReturn<PermissionCode>,
  "isDeleting" | "handleDeleteItems" | "isOpen" | "setIsOpen" | "hasMultipleItems"
>;

const ConfirmDeletePermissionCodesDialog = ({
  isDeleting,
  handleDeleteItems,
  isOpen,
  setIsOpen,
  hasMultipleItems,
}: ConfirmDeletePermissionCodesDialogProps) => {
  const titleText = hasMultipleItems ? "Confirm delete permission codes" : "Confirm delete permission code";
  const descriptionText = hasMultipleItems
    ? "Are you sure you want to delete these permission codes? This action cannot be undone."
    : "Are you sure you want to delete this permission code? This action cannot be undone.";
  const buttonText = hasMultipleItems ? "Delete permission codes" : "Delete permission code";

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

export default ConfirmDeletePermissionCodesDialog;
