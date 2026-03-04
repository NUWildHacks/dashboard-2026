import { zodResolver } from "@hookform/resolvers/zod";
import { Control, SubmitHandler, useForm, UseFormHandleSubmit, UseFormSetValue } from "react-hook-form";
import { toast } from "sonner";

import { submitJudging } from "../_actions";
import { judgingFormSchema, JudgingFormSchema } from "../_schemas";

export type UseJudgingFormReturn = {
  isSubmitting: boolean;
  control: Control<JudgingFormSchema>;
  handleSubmit: UseFormHandleSubmit<JudgingFormSchema>;
  onSubmit: SubmitHandler<JudgingFormSchema>;
  handleReset: () => void;
  setValue: UseFormSetValue<JudgingFormSchema>;
};

export const useJudgingForm = (): UseJudgingFormReturn => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { isSubmitting },
  } = useForm<JudgingFormSchema>({
    resolver: zodResolver(judgingFormSchema),
    defaultValues: {
      project_id: "",
      project_name: "",
      technical_complexity: 0,
      usefulness: 0,
      originality: 0,
      design: 0,
      presentation: 0,
      comments: "",
    },
  });

  const onSubmit = async (data: JudgingFormSchema) => {
    console.log(data);

    try {
      const result = await submitJudging(data);
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
      console.error("Submit judging form error:", errorMessage);

      toast.error("Failed to submit judging form", { description: errorMessage });
    }
  };

  const handleReset = () => {
    reset({
      project_id: "",
      project_name: "",
      technical_complexity: 0,
      usefulness: 0,
      originality: 0,
      design: 0,
      presentation: 0,
      comments: "",
    });
  };

  return {
    control,
    handleSubmit,
    setValue,
    onSubmit,
    isSubmitting,
    handleReset,
  };
};
