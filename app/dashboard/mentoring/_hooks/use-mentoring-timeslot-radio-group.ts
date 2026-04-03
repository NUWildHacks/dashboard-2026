"use client";

import { useState } from "react";
import { toast } from "sonner";

import type { JudgeAndMentorUser, MentoringTimeslot } from "@/types";

import { confirmMentoringTimeslot } from "../_actions";
import { TIMESLOT_CONFIRMATION_DEADLINE } from "../constants";

export type UseMentoringTimeslotRadioGroupReturn = {
  selectedMentoringTimeslot: MentoringTimeslot | undefined;
  setSelectedMentoringTimeslot: (selectedMentoringTimeslot: MentoringTimeslot) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
};

export const useMentoringTimeslotRadioGroup = (
  mentoring_timeslot: JudgeAndMentorUser["mentoring_timeslot"]
): UseMentoringTimeslotRadioGroupReturn => {
  const [selectedMentoringTimeslot, setSelectedMentoringTimeslot] = useState<MentoringTimeslot | undefined>(
    mentoring_timeslot
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmit = async () => {
    if (!selectedMentoringTimeslot) {
      return;
    }

    if (new Date().getTime() > TIMESLOT_CONFIRMATION_DEADLINE) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await confirmMentoringTimeslot(selectedMentoringTimeslot);
      const { success } = result;

      if (!success) {
        const { error } = result;
        throw new Error(error);
      }

      toast.success("Mentoring timeslot confirmed");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Confirm mentoring timeslot error:", errorMessage);

      toast.error("Failed to confirm mentoring timeslot", { description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedMentoringTimeslot,
    setSelectedMentoringTimeslot,
    onSubmit,
    isSubmitting,
  };
};
