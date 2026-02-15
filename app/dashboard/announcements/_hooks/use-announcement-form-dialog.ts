"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useFieldArray, useForm, UseFormReturn, UseFieldArrayReturn } from "react-hook-form";
import { toast } from "sonner";

import { createAnnouncement } from "../_actions/create-announcement.actions";
import { announcementFormSchema, AnnouncementFormSchema } from "../_schemas/announcement-form.schemas";
import { Announcement } from "../types";

export type UseAnnouncementFormDialogReturn = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  announcementId: Announcement["id"] | undefined;
  handleOpenAnnouncementFormDialog: (announcement?: Announcement) => void;
  onSubmit: SubmitHandler<AnnouncementFormSchema>;
  isSubmitting: boolean;
} & Pick<UseFormReturn<AnnouncementFormSchema>, "control" | "handleSubmit"> &
  Pick<UseFieldArrayReturn<AnnouncementFormSchema, "links">, "fields" | "append" | "remove">;

export const useAnnouncementFormDialog = (): UseAnnouncementFormDialogReturn => {
  const [announcementId, setAnnouncementId] = useState<Announcement["id"] | undefined>(undefined);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting },
  } = useForm<AnnouncementFormSchema>({
    resolver: zodResolver(announcementFormSchema),
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

  const onSubmit = async (data: AnnouncementFormSchema) => {
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

  const handleOpenAnnouncementFormDialog = (announcement?: Announcement) => {
    setAnnouncementId(announcement?.id);
    setIsOpen(true);

    reset({
      title: announcement?.title || "",
      body: announcement?.body || "",
      category: announcement?.category || undefined,
      links: announcement?.links.map((link) => ({ url: link })) || [],
    });
  };

  return {
    isOpen,
    setIsOpen,
    announcementId,
    handleOpenAnnouncementFormDialog,
    onSubmit,
    isSubmitting,
    control,
    handleSubmit,
    fields,
    append,
    remove,
  };
};
