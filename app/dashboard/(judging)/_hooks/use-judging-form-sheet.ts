"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyboardEvent, useState } from "react";
import { Control, SubmitHandler, useForm, UseFormHandleSubmit } from "react-hook-form";
import { toast } from "sonner";

import { JudgeUser } from "@/types";

import { submitJudging } from "../_actions";
import { judgingFormSchema, JudgingFormSchema } from "../_schemas";
import type { ProjectWithMetadata } from "../types";

export type UseJudgingFormSheetReturn = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedProjectWithMetadata: ProjectWithMetadata | undefined;
  handleOpenJudgingForm: (projectWithMetadata?: ProjectWithMetadata) => void;
  handleKeyDown: (event: KeyboardEvent, projectWithMetadata?: ProjectWithMetadata) => void;
  control: Control<JudgingFormSchema>;
  handleSubmit: UseFormHandleSubmit<JudgingFormSchema>;
  onSubmit: SubmitHandler<JudgingFormSchema>;
  isSubmitting: boolean;
};

export const useJudgingFormSheet = (judgeId: JudgeUser["id"], currentPath: string): UseJudgingFormSheetReturn => {
  const [selectedProjectWithMetadata, setSelectedProjectWithMetadata] = useState<ProjectWithMetadata | undefined>(
    undefined
  );
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
    if (!selectedProjectWithMetadata) return;

    try {
      const result = await submitJudging(data, selectedProjectWithMetadata.id, judgeId, currentPath);
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

  const handleKeyDown = (event: KeyboardEvent, projectWithMetadata?: ProjectWithMetadata) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleOpenJudgingForm(projectWithMetadata);
    }
  };

  const handleOpenJudgingForm = (projectWithMetadata?: ProjectWithMetadata) => {
    setSelectedProjectWithMetadata(projectWithMetadata);
    setIsOpen(true);

    reset({
      technical_complexity: projectWithMetadata?.judging_form?.technical_complexity ?? 0,
      usefulness: projectWithMetadata?.judging_form?.usefulness ?? 0,
      originality: projectWithMetadata?.judging_form?.originality ?? 0,
      design: projectWithMetadata?.judging_form?.design ?? 0,
      presentation: projectWithMetadata?.judging_form?.presentation ?? 0,
      comments: projectWithMetadata?.judging_form?.comments ?? "",
    });
  };

  return {
    isOpen,
    setIsOpen,
    selectedProjectWithMetadata,
    handleOpenJudgingForm,
    handleKeyDown,
    control,
    handleSubmit,
    onSubmit,
    isSubmitting,
  };
};
