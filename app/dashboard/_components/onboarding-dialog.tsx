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
import { JUDGE } from "@/constants";
import { JudgeUser, JudgeAndMentorUser } from "@/types";

type OnboardingDialogProps = {
  role: JudgeUser["role"] | JudgeAndMentorUser["role"];
  onboarded: boolean;
};

const OnboardingDialog = ({ role, onboarded }: OnboardingDialogProps) => {
  const [isOnboardingDialogOpen, setIsOnboardingDialogOpen] = useState(!onboarded);

  const descriptionText =
    role === JUDGE
      ? "project assignments will appear here once judging begins!"
      : "you'll be notified once mentoring sign-ups open!";

  const roleText = role === JUDGE ? "Judge" : "Judge and Mentor";

  return (
    <Dialog open={isOnboardingDialogOpen} onOpenChange={setIsOnboardingDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome!</DialogTitle>
          <DialogDescription>
            You&apos;re now officially a WildHacks 2026 {roleText}! Please take a moment to review your personal details
            and modality under settings.
            <br /> <br />
            You can now close this dialog and explore the dashboard -- {descriptionText}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={() => setIsOnboardingDialogOpen(false)}>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingDialog;
