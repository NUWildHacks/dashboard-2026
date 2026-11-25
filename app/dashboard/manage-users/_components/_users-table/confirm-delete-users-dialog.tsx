"use client";

import { Loader2 } from "lucide-react";
import { useMemo } from "react";

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
import type { User } from "@/types";

import { SelectedUsersList } from "..";

type ConfirmDeleteUsersDialogProps = {
  userId: User["id"];
  /** All users, to show the name of each user that will be deleted. */
  users: User[];
} & Pick<
  UseConfirmDeleteDialogReturn<User>,
  | "isDeleting"
  | "handleDeleteItems"
  | "isOpen"
  | "setIsOpen"
  | "hasMultipleItems"
  | "selectedItemIds"
>;

const ConfirmDeleteUsersDialog = ({
  userId,
  users,
  isDeleting,
  handleDeleteItems,
  selectedItemIds,
  isOpen,
  setIsOpen,
  hasMultipleItems,
}: ConfirmDeleteUsersDialogProps) => {
  const selectedUsers = useMemo(() => {
    const ids = new Set(selectedItemIds);
    return users.filter((user) => ids.has(user.id));
  }, [users, selectedItemIds]);
  const count = selectedItemIds.length;

  const cannotDelete =
    isDeleting || selectedItemIds.includes(userId);

  const titleText = hasMultipleItems
    ? `Confirm delete ${count} users`
    : "Confirm delete user";
  const descriptionText = hasMultipleItems
    ? `Are you sure you want to delete these ${count} users? This action cannot be undone.`
    : "Are you sure you want to delete this user? This action cannot be undone.";
  const buttonText = cannotDelete
    ? "Cannot delete yourself"
    : hasMultipleItems
      ? `Delete ${count} users`
      : "Delete user";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titleText}</DialogTitle>
          <DialogDescription>
            {descriptionText}
          </DialogDescription>
        </DialogHeader>
        <SelectedUsersList users={selectedUsers} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isDeleting}>
              Go Back
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={cannotDelete}
            onClick={handleDeleteItems}
          >
            {isDeleting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              buttonText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteUsersDialog;
