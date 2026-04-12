import { z } from "zod";

import { registrationFormBaseSchema } from "@/app/registration/_schemas/registration-form.schemas";
import { MODALITIES } from "@/constants/user.constants";
import { plainTextSingleLineSchema } from "@/lib";

export const editAdminProfileFormSchema = registrationFormBaseSchema
  .pick({
    first_name: true,
    last_name: true,
    dietary_restrictions: true,
    other_dietary_restrictions: true,
  })
  .refine((data) => !data.dietary_restrictions.includes("Other") || data.other_dietary_restrictions, {
    message: "Other dietary restrictions must be specified",
    path: ["other_dietary_restrictions"],
  });

export const editJudgeMentorProfileFormSchema = registrationFormBaseSchema
  .pick({
    first_name: true,
    last_name: true,
    dietary_restrictions: true,
    other_dietary_restrictions: true,
  })
  .extend({
    affiliated_company: plainTextSingleLineSchema
      .min(1, "Affiliated company is required")
      .max(100, "Affiliated company must be 100 characters or less"),
    modality: z.enum(MODALITIES, {
      message: "Modality is required",
    }),
    other_modality: plainTextSingleLineSchema.max(100, "Other modality must be 100 characters or less"),
  })
  .refine((data) => data.modality !== "Other" || data.other_modality, {
    message: "Other modality must be specified",
    path: ["other_modality"],
  })
  .refine((data) => !data.dietary_restrictions.includes("Other") || data.other_dietary_restrictions, {
    message: "Other dietary restrictions must be specified",
    path: ["other_dietary_restrictions"],
  });

export const editParticipantProfileFormSchema = registrationFormBaseSchema
  .pick({
    first_name: true,
    last_name: true,
    phone: true,
    github_username: true,
    dietary_restrictions: true,
    other_dietary_restrictions: true,
  })
  .refine((data) => !data.dietary_restrictions.includes("Other") || data.other_dietary_restrictions, {
    message: "Other dietary restrictions must be specified",
    path: ["other_dietary_restrictions"],
  });

export type EditAdminProfileFormSchema = z.infer<typeof editAdminProfileFormSchema>;
export type EditJudgeMentorProfileFormSchema = z.infer<typeof editJudgeMentorProfileFormSchema>;
export type EditParticipantProfileFormSchema = z.infer<typeof editParticipantProfileFormSchema>;
