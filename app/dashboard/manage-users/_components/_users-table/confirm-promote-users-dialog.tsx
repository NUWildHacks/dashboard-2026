"use client";

import { Loader2, TriangleAlert } from "lucide-react";
import { useMemo } from "react";

import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
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
import type { User } from "@/types";

import { SelectedUsersList } from "..";
import type { UsePromoteUsersDialogReturn } from "../../_hooks";

type ConfirmPromoteUsersDialogProps = {
  /** All users, to show the name of each user that will be promoted. */
  users: User[];
  /** Participant rows now (the same rows the registration limit counts). */
  participantCount: number;
  maxParticipants: number;
} & Pick<
  UsePromoteUsersDialogReturn,
  | "isOpen"
  | "setIsOpen"
  | "isPromoting"
  | "selectedUserIds"
  | "handlePromoteUsers"
>;

const ConfirmPromoteUsersDialog = ({
  users,
  participantCount,
  maxParticipants,
  isOpen,
  setIsOpen,
  isPromoting,
  selectedUserIds,
  handlePromoteUsers,
}: ConfirmPromoteUsersDialogProps) => {
  const selectedUsers = useMemo(() => {
    const ids = new Set(selectedUserIds);
    return users.filter((user) => ids.has(user.id));
  }, [users, selectedUserIds]);
  const count = selectedUserIds.length;
  const countAfter = participantCount + count;
  const overBy = countAfter - maxParticipants;

  const descriptionText =
    count > 1
      ? `This will move ${count} users off the waitlist, providing them access to the full participant dashboard (check-in QR code, resume upload, team matching). They will not be notified.`
      : "This user will be moved off the waitlist, providing them access to the full participant dashboard (check-in QR code, resume upload, team matching). They will not be notified.";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Promote to participant?</DialogTitle>
          <DialogDescription>
            {descriptionText}
          </DialogDescription>
        </DialogHeader>
        <SelectedUsersList users={selectedUsers} />
        {overBy > 0 && (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertDescription>
              This promotion will put the number of
              participants at {countAfter}, which is over
              the original limit of {maxParticipants}.
            </AlertDescription>
          </Alert>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={isPromoting}
            >
              Go Back
            </Button>
          </DialogClose>
          <Button
            disabled={isPromoting || count === 0}
            onClick={handlePromoteUsers}
          >
            {isPromoting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : overBy > 0 ? (
              "Promote anyway"
            ) : (
              "Promote"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmPromoteUsersDialog;
