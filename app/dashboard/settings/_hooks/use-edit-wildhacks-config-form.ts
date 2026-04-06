"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, UseFormHandleSubmit } from "react-hook-form";
import { Control } from "react-hook-form";
import { toast } from "sonner";

import { WildHacksConfig } from "@/types";

import { editWildhacksConfig } from "../_actions";
import { type EditWildhacksConfigFormSchema, editWildhacksConfigFormSchema } from "../_schemas";

export type UseEditWildhacksConfigFormReturn = {
  isSubmitting: boolean;
  isDirty: boolean;
  control: Control<EditWildhacksConfigFormSchema>;
  handleSubmit: UseFormHandleSubmit<EditWildhacksConfigFormSchema>;
  onSubmit: SubmitHandler<EditWildhacksConfigFormSchema>;
  handleReset: () => void;
};

export const useEditWildhacksConfigForm = (wildhacksConfig: WildHacksConfig): UseEditWildhacksConfigFormReturn => {
  const { max_team_size, max_participants, registration_deadline, start_time, end_time, crowd_favorite_password } =
    wildhacksConfig;

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, isDirty },
  } = useForm<EditWildhacksConfigFormSchema>({
    resolver: zodResolver(editWildhacksConfigFormSchema),
    defaultValues: {
      max_team_size: max_team_size.toString(),
      max_participants: max_participants.toString(),
      registration_deadline,
      start_time,
      end_time,
      crowd_favorite_password: crowd_favorite_password || "",
    },
  });

  const onSubmit = async (data: EditWildhacksConfigFormSchema) => {
    try {
      const result = await editWildhacksConfig(data);
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

      toast.success("WildHacks config updated successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Edit wildhacks config error:", errorMessage);

      toast.error("Failed to update wildhacks config", { description: errorMessage });
    }
  };

  const handleReset = () => {
    reset({
      max_team_size: max_team_size.toString(),
      max_participants: max_participants.toString(),
      registration_deadline,
      start_time,
      end_time,
      crowd_favorite_password: crowd_favorite_password || "",
    });
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    isSubmitting,
    isDirty,
    handleReset,
  };
};
