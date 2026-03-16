import { zodResolver } from "@hookform/resolvers/zod";
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
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, isDirty },
  } = useForm<EditParticipantProfileFormSchema>({
    resolver: zodResolver(editParticipantProfileFormSchema),
    defaultValues: user,
  });

  const onSubmit = async (data: EditParticipantProfileFormSchema) => {
    try {
      const result = await editProfile<EditParticipantProfileFormSchema>(data);
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

      toast.success("Profile updated successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Edit profile error:", errorMessage);

      toast.error("Failed to update profile", { description: errorMessage });
    }
  };

  const handleReset = () => {
    reset(user);
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
