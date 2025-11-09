import { Timestamp } from "firebase/firestore";
import { z } from "zod";

import countries from "../data/country.json";
import dietaryRestrictions from "../data/dietary-restrictions.json";
import fieldsOfStudy from "../data/field-of-study.json";
import genders from "../data/gender.json";
import levelsOfStudy from "../data/level-of-study.json";
import races from "../data/race.json";
import schools from "../data/schools.json";
import tshirtSizes from "../data/tshirt-size.json";

export const registrationFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
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
    )
    .transform((str) => Timestamp.fromDate(new Date(str))),
  phone: z.string().min(1, "Phone number is required"),
  country: z.enum(countries as [string, ...string[]], {
    message: "Please select a country",
  }),

  school: z.enum(schools as [string, ...string[]], {
    message: "Please select a school",
  }),
  level_of_study: z.enum(levelsOfStudy as [string, ...string[]], {
    message: "Please select a level of study",
  }),
  field_of_study: z.enum(fieldsOfStudy as [string, ...string[]], {
    message: "Please select a field of study",
  }),

  github_username: z.string().min(1, "GitHub username is required"),
  tshirt_size: z.enum(tshirtSizes as [string, ...string[]], {
    message: "Please select a t-shirt size",
  }),

  gender: z.enum(genders as [string, ...string[]], {
    message: "Please select a gender",
  }),
  race: z.enum(races as [string, ...string[]], {
    message: "Please select a race",
  }),
  dietary_restrictions: z.enum(dietaryRestrictions as [string, ...string[]], {
    message: "Please select a dietary restriction",
  }),
  other_dietary_restrictions: z.string().catch(""),

  mlh_code_of_conduct: z.boolean().refine((val) => val === true, {
    message: "You must agree to the MLH Code of Conduct",
  }),
  mlh_privacy_policy: z.boolean().refine((val) => val === true, {
    message: "You must agree to the MLH Privacy Policy",
  }),
  mlh_marketing: z.boolean(),
});

export type RegistrationFormSchema = z.infer<typeof registrationFormSchema>;
