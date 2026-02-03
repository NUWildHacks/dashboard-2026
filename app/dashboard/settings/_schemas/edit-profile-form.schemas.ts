import z from "zod";

import { registrationFormSchema } from "@/app/registration/_schemas/registration-form.schemas";
import { MODALITIES } from "@/constants/user.constants";

export const editAdminProfileFormSchema = registrationFormSchema.pick({
  first_name: true,
  last_name: true,
  email: true,
  dietary_restrictions: true,
  other_dietary_restrictions: true,
});

export const editJudgeProfileFormSchema = registrationFormSchema
  .pick({
    first_name: true,
    last_name: true,
    email: true,
    dietary_restrictions: true,
    other_dietary_restrictions: true,
  })
  .extend({
    affiliated_company: z.string().min(1, "Affiliated company is required"),
    modality: z.enum(MODALITIES, {
      message: "Modality is required",
    }),
  });

export const editParticipantProfileFormSchema = registrationFormSchema.pick({
  first_name: true,
  last_name: true,
  email: true,
  phone: true,
  github_username: true,
  dietary_restrictions: true,
  other_dietary_restrictions: true,
});

export type EditAdminProfileFormSchema = z.infer<typeof editAdminProfileFormSchema>;
export type EditJudgeProfileFormSchema = z.infer<typeof editJudgeProfileFormSchema>;
export type EditParticipantProfileFormSchema = z.infer<typeof editParticipantProfileFormSchema>;
