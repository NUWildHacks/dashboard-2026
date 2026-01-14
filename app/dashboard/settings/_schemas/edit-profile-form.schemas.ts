import z from "zod";

import { registrationFormSchema } from "@/app/registration/_schemas/registration-form.schemas";

export const editProfileFormSchema = registrationFormSchema.pick({
  first_name: true,
  last_name: true,
  email: true,
  phone: true,
  dietary_restrictions: true,
  other_dietary_restrictions: true,
  github_username: true,
});

export type EditProfileFormSchema = z.infer<typeof editProfileFormSchema>;
