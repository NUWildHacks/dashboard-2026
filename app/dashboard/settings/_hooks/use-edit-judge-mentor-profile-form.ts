import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import type { JudgeUser, MentorUser } from "@/types";

import { editProfile } from "../_actions";
import { type EditJudgeMentorProfileFormSchema, editJudgeMentorProfileFormSchema } from "../_schemas";

export type UseEditJudgeMentorProfileFormReturn = {
  onSubmit: SubmitHandler<EditJudgeMentorProfileFormSchema>;
  isSubmitting: boolean;
  isDirty: boolean;
  handleReset: () => void;
} & Pick<UseFormReturn<EditJudgeMentorProfileFormSchema>, "control" | "handleSubmit">;

export const useEditJudgeMentorProfileForm = (user: JudgeUser | MentorUser): UseEditJudgeMentorProfileFormReturn => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, isDirty },
  } = useForm<EditJudgeMentorProfileFormSchema>({
    resolver: zodResolver(editJudgeMentorProfileFormSchema),
    defaultValues: user,
  });

  const onSubmit = async (data: EditJudgeMentorProfileFormSchema) => {
    try {
      const result = await editProfile<EditJudgeMentorProfileFormSchema>(data);
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
