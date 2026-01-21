import z from "zod";

export const editWildhacksConfigFormSchema = z
  .object({
    max_team_size: z
      .string()
      .min(1, "Max team size is required")
      .refine((val) => Number(val) >= 1 && Number(val) <= 10, "Max team size must be between 1 and 10"),
    start_time: z.number().min(0, { message: "Start time must be milliseconds since epoch" }),
    end_time: z.number().min(0, { message: "End time must be milliseconds since epoch" }),
  })
  .refine((data) => data.start_time < data.end_time, {
    message: "Start time must be before end time",
    path: ["end_time"],
  });

export type EditWildhacksConfigFormSchema = z.infer<typeof editWildhacksConfigFormSchema>;
