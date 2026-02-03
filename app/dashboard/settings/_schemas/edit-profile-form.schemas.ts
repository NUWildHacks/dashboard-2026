import z from "zod";

import { registrationFormSchema } from "@/app/registration/_schemas/registration-form.schemas";

export const editAdminProfileFormSchema = registrationFormSchema.pick({
  first_name: true,
  last_name: true,
  email: true,
  dietary_restrictions: true,
  other_dietary_restrictions: true,
});

export const editJudgeProfileFormSchema = registrationFormSchema.pick({
  first_name: true,
  last_name: true,
  email: true,
  affiliated_company: true,
  modality: true,
  dietary_restrictions: true,
  other_dietary_restrictions: true,
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
