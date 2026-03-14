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

type OnboardingDialogProps = {
  onboarded: boolean;
};

const OnboardingDialog = ({ onboarded }: OnboardingDialogProps) => {
  const [isOnboardingDialogOpen, setIsOnboardingDialogOpen] = useState(!onboarded);

  return (
    <Dialog open={isOnboardingDialogOpen} onOpenChange={setIsOnboardingDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome!</DialogTitle>
          <DialogDescription>
            You are now onboarded for WildHacks 2026! You can close this dialog now and wait for projects to be assigned to you.
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
