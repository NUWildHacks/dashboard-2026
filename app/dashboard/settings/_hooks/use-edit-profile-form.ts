import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import type { User } from "@/types";

import { editProfile } from "../_actions";
import { type EditProfileFormSchema, editProfileFormSchema } from "../_schemas";

export type UseEditProfileFormReturn = {
  onSubmit: SubmitHandler<EditProfileFormSchema>;
  isSubmitting: boolean;
  isDirty: boolean;
  handleReset: () => void;
} & Pick<UseFormReturn<EditProfileFormSchema>, "control" | "handleSubmit">;

export const useEditProfileForm = (user: User): UseEditProfileFormReturn => {
  const { first_name, last_name, email, phone, github_username, dietary_restrictions, other_dietary_restrictions } =
    user;

  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, isDirty },
  } = useForm<EditProfileFormSchema>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: {
      first_name,
      last_name,
      email,
      phone,
      github_username,
      dietary_restrictions,
      other_dietary_restrictions,
    },
  });

  const onSubmit = async (data: EditProfileFormSchema) => {
    try {
      const result = await editProfile(data);
      const { success } = result;

      if (!success) {
        const { field, error } = result;

        if (field) {
          setError(field, {
            type: "server",
            message: error,
          });
        } else {
          toast.error("Failed to update profile", { description: error });
        }
        return;
      }

      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Edit profile error:", errorMessage);

      toast.error("Failed to update profile", { description: errorMessage });
    }
  };

  const handleReset = () => {
    reset({
      first_name,
      last_name,
      email,
      phone,
      github_username,
      dietary_restrictions,
      other_dietary_restrictions,
    });
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    isSubmitting,
    isDirty,
    handleReset,
  };
};
