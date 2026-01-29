import z from "zod";

import { ONE_DAY } from "@/constants";

export const editWildhacksConfigFormSchema = z
  .object({
    max_team_size: z
      .string()
      .min(1, "Max team size is required")
      .refine((val) => Number(val) >= 1 && Number(val) <= 10, "Max team size must be between 1 and 10"),
    max_participants: z
      .string()
      .min(1, "Max participants is required")
      .refine((val) => Number(val) >= 1, "Max participants must be at least 1"),
    registration_deadline: z.number().min(1, { message: "Registration deadline must be milliseconds since epoch" }),
    start_time: z.number().min(1, { message: "Start time must be milliseconds since epoch" }),
    end_time: z.number().min(1, { message: "End time must be milliseconds since epoch" }),
  })
  .refine((data) => data.registration_deadline < data.start_time, {
    message: "Registration deadline must be before event start time",
    path: ["registration_deadline"],
  })
  .refine((data) => data.start_time < data.end_time, {
    message: "Start time must be before end time",
    path: ["end_time"],
  })
  .refine((data) => data.end_time - data.start_time >= ONE_DAY, {
    message: "Event duration must be at least one day",
    path: ["end_time"],
  });

export type EditWildhacksConfigFormSchema = z.infer<typeof editWildhacksConfigFormSchema>;
