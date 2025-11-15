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
} from "@/constants/user";

export const registrationFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  date_of_birth: z
    .string()
    .min(1, "Date of birth is required")
    .refine(
      (date) => {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 13;
      },
      { message: "You must be at least 13 years old" }
    ),
  phone: z.e164("Invalid phone number"),
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

  github_username: z.string().min(1, "GitHub username is required"),
  tshirt_size: z.enum(TSHIRT_SIZES, {
    message: "Please select a t-shirt size",
  }),

  gender: z.enum(GENDERS, {
    message: "Please select a gender",
  }),
  race: z.enum(RACES, {
    message: "Please select a race/ethnicity",
  }),
  dietary_restrictions: z.enum(DIETARY_RESTRICTIONS, {
    message: "Please select a dietary restriction",
  }),
  other_dietary_restrictions: z.string(),

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
});

export type RegistrationFormSchema = z.infer<typeof registrationFormSchema>;
