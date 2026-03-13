import isMobilePhone from "validator/lib/isMobilePhone";
import { z } from "zod";

import {
  COUNTRIES,
  DIETARY_RESTRICTIONS,
  FIELDS_OF_STUDY,
  GENDERS,
  LEVELS_OF_STUDY,
  RACES,
  SCHOOLS,
  TSHIRT_SIZES,
} from "@/constants";
import { githubUsernameSchema, plainTextMultiLineSchema, plainTextSingleLineSchema } from "@/lib";

export const registrationFormSchema = z
  .object({
    first_name: plainTextSingleLineSchema
      .min(1, "First name is required")
      .max(50, "First name must be 50 characters or less"),
    last_name: plainTextSingleLineSchema
      .min(1, "Last name is required")
      .max(50, "Last name must be 50 characters or less"),
    email: z.email("Invalid email address"),
    age: z
      .string()
      .min(1, "Age is required")
      .refine((val) => Number(val) >= 13, "You must be at least 13 years old"),
    phone: z.string().refine((val) => isMobilePhone(val, "en-US"), "Invalid phone number"),
    country: z.enum(COUNTRIES, {
      message: "Please select a country",
    }),

    school: z.enum(SCHOOLS, {
      message: "Please select a school",
    }),
    level_of_study: z.enum(LEVELS_OF_STUDY, {
      message: "Please select a level of study",
    }),
    field_of_study: z.enum(FIELDS_OF_STUDY, {
      message: "Please select a field of study",
    }),

    github_username: githubUsernameSchema,
    tshirt_size: z.enum(TSHIRT_SIZES, {
      message: "Please select a t-shirt size",
    }),

    gender: z.enum(GENDERS, {
      message: "Please select a gender",
    }),
    race: z.enum(RACES, {
      message: "Please select a race/ethnicity",
    }),
    dietary_restrictions: z.array(z.enum(DIETARY_RESTRICTIONS)).min(1, "Please select a dietary restriction"),
    other_dietary_restrictions: plainTextMultiLineSchema.max(
      500,
      "Other dietary restrictions must be 500 characters or less"
    ),

    permission_code: z
      .string()
      .regex(/^[a-zA-Z0-9]{20}$/, "Invalid permission code")
      .or(z.literal("")),

    mlh_code_of_conduct: z.boolean().refine((val) => val === true, {
      message: "You must agree to the MLH Code of Conduct",
    }),
    mlh_privacy_policy: z.boolean().refine((val) => val === true, {
      message: "You must agree to the MLH Privacy Policy",
    }),
    mlh_marketing: z.boolean(),
  })
  .refine((data) => !data.dietary_restrictions.includes("Other") || data.other_dietary_restrictions, {
    message: "Other dietary restrictions must be specified",
    path: ["other_dietary_restrictions"],
  });

export type RegistrationFormSchema = z.infer<typeof registrationFormSchema>;
