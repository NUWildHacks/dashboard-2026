import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Control, SubmitHandler, useForm, UseFormHandleSubmit } from "react-hook-form";
import { toast } from "sonner";

import { submitJudging } from "../_actions";
import { judgingFormSchema, JudgingFormSchema } from "../_schemas";
import { Project } from "../../project/types";

export type UseJudgingFormReturn = {
  isSubmitting: boolean;
  control: Control<JudgingFormSchema>;
  handleSubmit: UseFormHandleSubmit<JudgingFormSchema>;
  onSubmit: SubmitHandler<JudgingFormSchema>;
  handleReset: () => void;
  handleSelectProject: (projectId: Project["id"]) => void;
  selectedProjectData: Pick<Project, "id" | "name"> | undefined;
};

export const useJudgingForm = (assignedProjects: Project[]): UseJudgingFormReturn => {
  const [selectedProjectData, setSelectedProjectData] = useState<Pick<Project, "id" | "name"> | undefined>(undefined);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting },
  } = useForm<JudgingFormSchema>({
    resolver: zodResolver(judgingFormSchema),
    defaultValues: {
      technical_complexity: 0,
      usefulness: 0,
      originality: 0,
      design: 0,
      presentation: 0,
      comments: "",
    },
  });

  const onSubmit = async (data: JudgingFormSchema) => {
    if (!selectedProjectData) return;

    try {
      const result = await submitJudging(data, selectedProjectData);
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

  const handleSelectProject = (projectId: Project["id"]) => {
    const selectedProject = assignedProjects.find((project) => project.id === projectId);
    if (!selectedProject) return;
    setSelectedProjectData({ id: selectedProject.id, name: selectedProject.name });
  };

  const handleReset = () => {
    reset({
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
    onSubmit,
    isSubmitting,
    handleSelectProject,
    handleReset,
    selectedProjectData,
  };
};
