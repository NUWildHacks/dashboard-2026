"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { createEvent } from "../_actions/create-event.actions";
import { createEventDialogSchema, CreateEventDialogSchema } from "../_schemas/create-event-dialog.schemas";

export type UseCreateEventDialogReturn = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: SubmitHandler<CreateEventDialogSchema>;
  isSubmitting: boolean;
} & Pick<UseFormReturn<CreateEventDialogSchema>, "control" | "handleSubmit">;

export const useCreateEventDialog = (): UseCreateEventDialogReturn => {
  const router = useRouter();

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
      start_time: "",
      end_time: "",
    },
  });

  const onSubmit = async (data: CreateEventDialogSchema) => {
    try {
      const result = await createEvent(data);
      const { success } = result;

      if (!success) {
        const { field, error } = result;

        if (field) {
          setError(field, {
            type: "server",
            message: error,
          });
        } else {
          toast.error("Failed to create event", { description: error });
        }
        return;
      }

      reset();
      setIsOpen(false);
      router.refresh();
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
