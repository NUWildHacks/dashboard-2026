import { z } from "zod";

import { EVENT_CATEGORIES } from "../constants";

export const createEventDialogSchema = z
  .object({
    category: z.enum(EVENT_CATEGORIES, { message: "Category is required" }),
    title: z.string().min(1, { message: "Title is required" }),
    body: z.string().min(1, { message: "Body is required" }),
    day: z.string().min(1, { message: "Day is required" }),
    start_time: z
      .string()
      .min(0, { message: "Start time is required" })
      .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, { message: "Start time must be in HH:mm format" }),
    end_time: z
      .string()
      .min(0, { message: "End time is required" })
      .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, { message: "End time must be in HH:mm format" }),
  })
  .refine((data) => data.end_time > data.start_time, {
    message: "End time must be after start time",
    path: ["end_time"],
  });

export type CreateEventDialogSchema = z.infer<typeof createEventDialogSchema>;
