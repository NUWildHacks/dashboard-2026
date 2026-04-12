"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, UseFormHandleSubmit } from "react-hook-form";
import { Control } from "react-hook-form";
import { UseFormGetValues, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { toast } from "sonner";

import { WildHacksConfig, WildHacksSecrets } from "@/types";

import { editWildhacksConfig } from "../_actions";
import { type EditWildhacksConfigFormSchema, editWildhacksConfigFormSchema } from "../_schemas";

export type UseEditWildhacksConfigFormReturn = {
  isSubmitting: boolean;
  isDirty: boolean;
  control: Control<EditWildhacksConfigFormSchema>;
  handleSubmit: UseFormHandleSubmit<EditWildhacksConfigFormSchema>;
  watch: UseFormWatch<EditWildhacksConfigFormSchema>;
  setValue: UseFormSetValue<EditWildhacksConfigFormSchema>;
  getValues: UseFormGetValues<EditWildhacksConfigFormSchema>;
  onSubmit: SubmitHandler<EditWildhacksConfigFormSchema>;
  handleReset: () => void;
};

export const useEditWildhacksConfigForm = (
  wildhacksConfig: WildHacksConfig & WildHacksSecrets
): UseEditWildhacksConfigFormReturn => {
  const {
    max_team_size,
    max_participants,
    registration_deadline,
    start_time,
    submission_deadline,
    end_time,
    crowd_favorite_password,
    crowd_favorite_opt_in_started,
    crowd_favorite_opt_in_open,
    crowd_favorite_voting_started,
    crowd_favorite_voting_open,
  } = wildhacksConfig;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
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
      submission_deadline,
      end_time,
      crowd_favorite_password: crowd_favorite_password || "",
      crowd_favorite_opt_in_started: crowd_favorite_opt_in_started || false,
      crowd_favorite_opt_in_open: crowd_favorite_opt_in_open || false,
      crowd_favorite_voting_started: crowd_favorite_voting_started || false,
      crowd_favorite_voting_open: crowd_favorite_voting_open || false,
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

      reset(data);
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
      submission_deadline,
      end_time,
      crowd_favorite_password: crowd_favorite_password || "",
      crowd_favorite_opt_in_started: crowd_favorite_opt_in_started || false,
      crowd_favorite_opt_in_open: crowd_favorite_opt_in_open || false,
      crowd_favorite_voting_started: crowd_favorite_voting_started || false,
      crowd_favorite_voting_open: crowd_favorite_voting_open || false,
    });
  };

  return {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    onSubmit,
    isSubmitting,
    isDirty,
    handleReset,
  };
};
