import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import type { ParticipantUser } from "@/types";

import { editProfile } from "../_actions";
import { type EditParticipantProfileFormSchema, editParticipantProfileFormSchema } from "../_schemas";

export type UseEditParticipantProfileFormReturn = {
  onSubmit: SubmitHandler<EditParticipantProfileFormSchema>;
  isSubmitting: boolean;
  isDirty: boolean;
  handleReset: () => void;
} & Pick<UseFormReturn<EditParticipantProfileFormSchema>, "control" | "handleSubmit">;

export const useEditParticipantProfileForm = (user: ParticipantUser): UseEditParticipantProfileFormReturn => {
  const { first_name, last_name, email, phone, github_username, dietary_restrictions, other_dietary_restrictions } =
    user;

  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, isDirty },
  } = useForm<EditParticipantProfileFormSchema>({
    resolver: zodResolver(editParticipantProfileFormSchema),
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

  const onSubmit = async (data: EditParticipantProfileFormSchema) => {
    try {
      const result = await editProfile(data);
      const { success } = result;

      if (!success) {
        const { field, error } = result;

        if (!field) {
          throw new Error(error);
        }

        setError(field as keyof EditParticipantProfileFormSchema, {
          type: "server",
          message: error,
        });
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
