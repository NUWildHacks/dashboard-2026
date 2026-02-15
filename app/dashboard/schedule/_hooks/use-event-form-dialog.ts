"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { findDayLabel, millisecondsToTime } from "@/lib";
import { WildHacksConfig } from "@/types";

import { createEvent } from "../_actions/create-event.actions";
import { eventFormDialogSchema, EventFormDialogSchema } from "../_schemas/event-form-dialog.schemas";
import { CalendarDay, Event } from "../types";

export type UseEventFormDialogReturn = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  eventId: Event["id"] | undefined;
  handleOpenEventFormDialog: (event?: Event) => void;
  onSubmit: SubmitHandler<EventFormDialogSchema>;
  isSubmitting: boolean;
} & Pick<UseFormReturn<EventFormDialogSchema>, "control" | "handleSubmit">;

export const useEventFormDialog = (
  start_time: WildHacksConfig["start_time"],
  end_time: WildHacksConfig["end_time"],
  availableDays: CalendarDay[]
): UseEventFormDialogReturn => {
  const [eventId, setEventId] = useState<Event["id"] | undefined>(undefined);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting },
  } = useForm<EventFormDialogSchema>({
    resolver: zodResolver(eventFormDialogSchema),
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

  const onSubmit = async (data: EventFormDialogSchema) => {
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

  const handleOpenEventFormDialog = (event?: Event) => {
    setEventId(event?.id);
    setIsOpen(true);

    reset({
      category: event?.category,
      day: findDayLabel(event?.start_time, availableDays),
      title: event?.title,
      body: event?.body,
      location: event?.location,
      start_time: event?.start_time ? millisecondsToTime(event.start_time) : undefined,
      end_time: event?.end_time ? millisecondsToTime(event.end_time) : undefined,
    });
  };

  return {
    isOpen,
    setIsOpen,
    eventId,
    handleOpenEventFormDialog,
    onSubmit,
    isSubmitting,
    control,
    handleSubmit,
  };
};
