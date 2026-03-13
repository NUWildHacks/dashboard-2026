import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import type { AdminUser } from "@/types";

import { editProfile } from "../_actions";
import { type EditAdminProfileFormSchema, editAdminProfileFormSchema } from "../_schemas";

export type UseEditAdminProfileFormReturn = {
  onSubmit: SubmitHandler<EditAdminProfileFormSchema>;
  isSubmitting: boolean;
  isDirty: boolean;
  handleReset: () => void;
} & Pick<UseFormReturn<EditAdminProfileFormSchema>, "control" | "handleSubmit">;

export const useEditAdminProfileForm = (user: AdminUser): UseEditAdminProfileFormReturn => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, isDirty },
  } = useForm<EditAdminProfileFormSchema>({
    resolver: zodResolver(editAdminProfileFormSchema),
    defaultValues: user,
  });

  const onSubmit = async (data: EditAdminProfileFormSchema) => {
    try {
      const result = await editProfile<EditAdminProfileFormSchema>(data);
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
