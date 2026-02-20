"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { combineDateAndTime, findDayLabel, millisecondsToTime, parseDateLabel } from "@/lib";
import { WildHacksConfig } from "@/types";

import { saveEvent, SaveEventData } from "../_actions";
import { eventFormDialogSchema, EventFormDialogSchema } from "../_schemas";
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
      const dayDate = parseDateLabel(data.day);
      if (!dayDate) {
        setError("day", {
          type: "manual",
          message: "Invalid day selected",
        });
        return;
      }

      const startTimeMs = combineDateAndTime(dayDate, data.start_time);
      const endTimeMs = combineDateAndTime(dayDate, data.end_time);

      if (startTimeMs === 0 || endTimeMs === 0) {
        setError(startTimeMs === 0 ? "start_time" : "end_time", {
          type: "manual",
          message: "Invalid time format",
        });
        return;
      }

      const transformedData: SaveEventData = {
        ...data,
        start_time: startTimeMs,
        end_time: endTimeMs,
      };

      const result = await saveEvent(transformedData, start_time, end_time, eventId);
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
      console.error("Save event error:", errorMessage);

      toast.error("Failed to save event", { description: errorMessage });
    }
  };

  const handleOpenEventFormDialog = (event?: Event) => {
    setEventId(event?.id);
    setIsOpen(true);

    reset({
      category: event?.category,
      day: findDayLabel(event?.start_time, availableDays) ?? "",
      title: event?.title ?? "",
      body: event?.body ?? "",
      location: event?.location ?? "",
      start_time: event?.start_time ? millisecondsToTime(event.start_time) : "",
      end_time: event?.end_time ? millisecondsToTime(event.end_time) : "",
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
