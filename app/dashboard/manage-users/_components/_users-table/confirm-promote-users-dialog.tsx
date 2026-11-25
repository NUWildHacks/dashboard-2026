"use client";

import { Loader2, TriangleAlert } from "lucide-react";

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

import type { UsePromoteUsersDialogReturn } from "../../_hooks";

type ConfirmPromoteUsersDialogProps = {
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
  participantCount,
  maxParticipants,
  isOpen,
  setIsOpen,
  isPromoting,
  selectedUserIds,
  handlePromoteUsers,
}: ConfirmPromoteUsersDialogProps) => {
  const count = selectedUserIds.length;
  const countAfter = participantCount + count;
  const overBy = countAfter - maxParticipants;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Promote to participant?</DialogTitle>
          <DialogDescription>
            This will move {count} user(s) off the waitlist,
            providing them access to the full participant
            dashboard (check-in QR code, reusme upload, team
            matching). The app does not notify them.
          </DialogDescription>
        </DialogHeader>
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
