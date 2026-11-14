"use client";

import { useState } from "react";

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
import { JUDGE, EVENT_NAME_YEAR } from "@/constants";
import { JudgeUser } from "@/types";

type OnboardingDialogProps = {
  role: JudgeUser["role"];
  onboarded: boolean;
};

const OnboardingDialog = ({
  role,
  onboarded,
}: OnboardingDialogProps) => {
  const [
    isOnboardingDialogOpen,
    setIsOnboardingDialogOpen,
  ] = useState(!onboarded);

  const descriptionText =
    role === JUDGE
      ? "project assignments will appear here once judging begins!"
      : "mentoring sign-up slots are now live, and your timeslots have been pre-assigned. Please review and update them as needed!";

  const roleText =
    role === JUDGE ? "Judge" : "Judge and Mentor";

  return (
    <Dialog
      open={isOnboardingDialogOpen}
      onOpenChange={setIsOnboardingDialogOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome!</DialogTitle>
          <DialogDescription>
            You&apos;re now officially a {EVENT_NAME_YEAR}{" "}
            {roleText}! Please take a moment to review your
            personal details and modality under settings.
            <br /> <br />
            You can now close this dialog and explore the
            dashboard -- {descriptionText}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={() =>
                setIsOnboardingDialogOpen(false)
              }
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingDialog;
