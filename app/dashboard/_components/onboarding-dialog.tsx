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
import { JudgeUser, MentorUser } from "@/types";

type OnboardingDialogProps = {
  role: JudgeUser["role"] | MentorUser["role"];
  onboarded: boolean;
};

const OnboardingDialog = ({ role, onboarded }: OnboardingDialogProps) => {
  const [isOnboardingDialogOpen, setIsOnboardingDialogOpen] = useState(!onboarded);

  const descriptionText =
    role === JUDGE
      ? "You are now onboarded for WildHacks 2026 as a judge! You can close this dialog now and wait for projects to be assigned to you."
      : "You are now onboarded for WildHacks 2026 as a mentor! You can close this dialog now and wait for projects to be assigned to you.";

  return (
    <Dialog open={isOnboardingDialogOpen} onOpenChange={setIsOnboardingDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome!</DialogTitle>
          <DialogDescription>{descriptionText}</DialogDescription>
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
