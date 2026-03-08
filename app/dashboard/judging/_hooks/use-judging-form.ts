"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Control, SubmitHandler, useForm, UseFormHandleSubmit } from "react-hook-form";
import { toast } from "sonner";

import { UseItemDialogReturn } from "@/hooks";
import { JudgeUser } from "@/types";

import { submitJudging } from "../_actions";
import { judgingFormSchema, JudgingFormSchema } from "../_schemas";
import type { Project } from "../types";

export type UseJudgingFormReturn = {
  isSubmitting: boolean;
  control: Control<JudgingFormSchema>;
  handleSubmit: UseFormHandleSubmit<JudgingFormSchema>;
  onSubmit: SubmitHandler<JudgingFormSchema>;
};

export const useJudgingForm = (
  selectedItem: UseItemDialogReturn<Project>["selectedItem"],
  judgeData: Pick<JudgeUser, "id" | "first_name" | "last_name">
): UseJudgingFormReturn => {
  const {
    control,
    handleSubmit,
    setError,
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
    if (!selectedItem) return;

    try {
      const result = await submitJudging(data, selectedItem, judgeData);
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Submit judging form error:", errorMessage);

      toast.error("Failed to submit judging form", { description: errorMessage });
    }
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    isSubmitting,
  };
};
