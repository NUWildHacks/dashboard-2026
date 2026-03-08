"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Control, SubmitHandler, useForm, UseFormHandleSubmit } from "react-hook-form";
import { toast } from "sonner";

import { JudgeUser } from "@/types";

import { submitJudging } from "../_actions";
import { judgingFormSchema, JudgingFormSchema } from "../_schemas";
import type { ProjectWithJudgingForm } from "../types";

export type UseJudgingFormSheetReturn = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedProjectWithJudgingForm: ProjectWithJudgingForm | undefined;
  handleOpenJudgingForm: (projectWithJudgingForm?: ProjectWithJudgingForm) => void;
  control: Control<JudgingFormSchema>;
  handleSubmit: UseFormHandleSubmit<JudgingFormSchema>;
  onSubmit: SubmitHandler<JudgingFormSchema>;
  isSubmitting: boolean;
};

export const useJudgingFormSheet = (judgeId: JudgeUser["id"]): UseJudgingFormSheetReturn => {
  const [selectedProjectWithJudgingForm, setSelectedProjectWithJudgingForm] = useState<
    ProjectWithJudgingForm | undefined
  >(undefined);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting },
  } = useForm<JudgingFormSchema>({
    resolver: zodResolver(judgingFormSchema),
    defaultValues: {
      technical_complexity: 0,
      usefulness: 0,
      originality: 0,
      design: 0,
      presentation: 0,
      comments: "",
    },
  });

  const onSubmit = async (data: JudgingFormSchema) => {
    if (!selectedProjectWithJudgingForm) return;

    try {
      const result = await submitJudging(data, selectedProjectWithJudgingForm.id, judgeId);
      const { success } = result;

      if (!success) {
        const { field, error } = result;

        if (!field) {
          throw new Error(error);
        }

        setError(field, {
          type: "server",
          message: error,
        });
        return;
      }

      reset();
      setIsOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Submit judging form error:", errorMessage);

      toast.error("Failed to submit judging form", { description: errorMessage });
    }
  };

  const handleOpenJudgingForm = (projectWithJudgingForm?: ProjectWithJudgingForm) => {
    setSelectedProjectWithJudgingForm(projectWithJudgingForm);
    setIsOpen(true);

    reset({
      technical_complexity: projectWithJudgingForm?.judging_form?.technical_complexity ?? 0,
      usefulness: projectWithJudgingForm?.judging_form?.usefulness ?? 0,
      originality: projectWithJudgingForm?.judging_form?.originality ?? 0,
      design: projectWithJudgingForm?.judging_form?.design ?? 0,
      presentation: projectWithJudgingForm?.judging_form?.presentation ?? 0,
      comments: projectWithJudgingForm?.judging_form?.comments ?? "",
    });
  };

  return {
    isOpen,
    setIsOpen,
    selectedProjectWithJudgingForm,
    handleOpenJudgingForm,
    control,
    handleSubmit,
    onSubmit,
    isSubmitting,
  };
};
