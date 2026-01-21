"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useFieldArray, useForm, UseFormReturn, UseFieldArrayReturn } from "react-hook-form";
import { toast } from "sonner";

import { createAnnouncement } from "../_actions/create-announcement.actions";
import {
  createAnnouncementDialogSchema,
  CreateAnnouncementDialogSchema,
} from "../_schemas/create-announcement-dialog.schemas";

export type UseCreateAnnouncementDialogReturn = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: SubmitHandler<CreateAnnouncementDialogSchema>;
  isSubmitting: boolean;
} & Pick<UseFormReturn<CreateAnnouncementDialogSchema>, "control" | "handleSubmit"> &
  Pick<UseFieldArrayReturn<CreateAnnouncementDialogSchema, "links">, "fields" | "append" | "remove">;

export const useCreateAnnouncementDialog = (): UseCreateAnnouncementDialogReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateAnnouncementDialogSchema>({
    resolver: zodResolver(createAnnouncementDialogSchema),
    defaultValues: {
      title: "",
      body: "",
      category: undefined,
      links: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  });

  const onSubmit = async (data: CreateAnnouncementDialogSchema) => {
    try {
      const result = await createAnnouncement(data);
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
      console.error("Create announcement error:", errorMessage);

      toast.error("Failed to create announcement", { description: errorMessage });
    }
  };

  return {
    isOpen,
    setIsOpen,
    onSubmit,
    isSubmitting,
    control,
    handleSubmit,
    fields,
    append,
    remove,
  };
};
