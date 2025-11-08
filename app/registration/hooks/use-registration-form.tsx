import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { RegistrationFormSchema, registrationFormSchema } from "../schemas/registration-form-schema";

export default function useRegistrationForm() {
  const form = useForm<RegistrationFormSchema>({
    resolver: zodResolver(registrationFormSchema),
  });

  const onSubmit = (data: RegistrationFormSchema) => {
    console.log(data);
  };

  return { form, onSubmit };
}
