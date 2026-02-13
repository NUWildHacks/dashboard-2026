import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import type { JudgeUser } from "@/types";

import { editProfile } from "../_actions";
import { type EditJudgeProfileFormSchema, editJudgeProfileFormSchema } from "../_schemas";

export type UseEditJudgeProfileFormReturn = {
  onSubmit: SubmitHandler<EditJudgeProfileFormSchema>;
  isSubmitting: boolean;
  isDirty: boolean;
  handleReset: () => void;
} & Pick<UseFormReturn<EditJudgeProfileFormSchema>, "control" | "handleSubmit">;

export const useEditJudgeProfileForm = (user: JudgeUser): UseEditJudgeProfileFormReturn => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, isDirty },
  } = useForm<EditJudgeProfileFormSchema>({
    resolver: zodResolver(editJudgeProfileFormSchema),
    defaultValues: user,
  });

  const onSubmit = async (data: EditJudgeProfileFormSchema) => {
    try {
      const result = await editProfile<EditJudgeProfileFormSchema>(data);
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
