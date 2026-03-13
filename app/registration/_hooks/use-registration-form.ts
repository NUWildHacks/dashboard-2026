import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { DASHBOARD_PATH } from "@/constants";
import { WildHacksConfig } from "@/types";

import { registerUser } from "../_actions";
import { registrationFormSchema, RegistrationFormSchema } from "../_schemas";

export type UseRegistrationFormReturn = {
  onSubmit: SubmitHandler<RegistrationFormSchema>;
  isSubmitting: boolean;
} & Pick<UseFormReturn<RegistrationFormSchema>, "control" | "handleSubmit">;

export const useRegistrationForm = (
  userEmail: string,
  start_time: WildHacksConfig["start_time"],
  end_time: WildHacksConfig["end_time"],
  max_participants: WildHacksConfig["max_participants"],
  registration_deadline: WildHacksConfig["registration_deadline"]
): UseRegistrationFormReturn => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<RegistrationFormSchema>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: userEmail,
      phone: "",
      age: "",
      country: "",

      school: "",
      level_of_study: "",
      field_of_study: "",

      github_username: "",
      tshirt_size: "",

      gender: "",
      race: "",
      dietary_restrictions: [],
      other_dietary_restrictions: "",

      permission_code: "",

      mlh_code_of_conduct: false,
      mlh_privacy_policy: false,
      mlh_marketing: false,
    },
  });

  const onSubmit = async (data: RegistrationFormSchema) => {
    try {
      const result = await registerUser(data, start_time, end_time, max_participants, registration_deadline);
      const { success } = result;

      if (!success) {
        const { field, error } = result;

        if (!field) {
          throw new Error(error);
        }

        setError(field, {
          type: "server",
          message: error,
        });
        return;
      }

      router.replace(DASHBOARD_PATH);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Registration error:", errorMessage);

      toast.error("Registration failed", { description: errorMessage });
    }
  };

  return { control, handleSubmit, onSubmit, isSubmitting };
};
