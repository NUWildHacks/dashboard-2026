import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { RegistrationFormSchema, registrationFormSchema } from "../schemas/registration-form-schema";

export default function useRegistrationForm() {
  const form = useForm<RegistrationFormSchema>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      country: "",

      school: "",
      level_of_study: "",
      field_of_study: "",

      github_username: "",
      tshirt_size: "",

      gender: "",
      race: "",
      dietary_restrictions: "", // TODO: Array for multi-select
      other_dietary_restrictions: "",

      mlh_code_of_conduct: false,
      mlh_privacy_policy: false,
      mlh_marketing: false,
    },
  });

  const onSubmit = (data: RegistrationFormSchema) => {
    console.log(data);
  };

  return { form, onSubmit };
}
