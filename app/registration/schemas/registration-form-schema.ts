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
  email: z.string().email("Invalid email address"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  github_username: z.string().min(1, "GitHub username is required"),
  date_of_birth: z.date({
    error: (issue) => (issue.input === undefined ? "Date of birth is required" : "Invalid date"),
  }),
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

  mlh_code_of_conduct: z.boolean().refine((val) => val === true, {
    message: "You must agree to the MLH Code of Conduct",
  }),
  mlh_privacy_policy: z.boolean().refine((val) => val === true, {
    message: "You must agree to the MLH Privacy Policy",
  }),
  mlh_marketing: z.boolean(),
});

export type RegistrationFormSchema = z.infer<typeof registrationFormSchema>;
