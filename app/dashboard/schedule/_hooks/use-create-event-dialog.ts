"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { WildHacksConfig } from "@/types";

import { createEvent } from "../_actions/create-event.actions";
import { createEventDialogSchema, CreateEventDialogSchema } from "../_schemas/create-event-dialog.schemas";

export type UseCreateEventDialogReturn = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: SubmitHandler<CreateEventDialogSchema>;
  isSubmitting: boolean;
} & Pick<UseFormReturn<CreateEventDialogSchema>, "control" | "handleSubmit">;

export const useCreateEventDialog = (
  start_time: WildHacksConfig["start_time"],
  end_time: WildHacksConfig["end_time"]
): UseCreateEventDialogReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateEventDialogSchema>({
    resolver: zodResolver(createEventDialogSchema),
    defaultValues: {
      category: undefined,
      day: "",
      title: "",
      body: "",
      location: "",
      start_time: "",
      end_time: "",
    },
  });

  const onSubmit = async (data: CreateEventDialogSchema) => {
    try {
      const result = await createEvent(data, start_time, end_time);
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
      console.error("Create event error:", errorMessage);

      toast.error("Failed to create event", { description: errorMessage });
    }
  };

  return {
    isOpen,
    setIsOpen,
    onSubmit,
    isSubmitting,
    control,
    handleSubmit,
  };
};
