"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import type { Project } from "@/app/dashboard/project/_types";

import { editProject } from "../_actions";
import { editProjectFormSchema, type EditProjectFormSchema } from "../_schemas";

export type UseEditProjectFormReturn = {
  onSubmit: SubmitHandler<EditProjectFormSchema>;
  isSubmitting: boolean;
  isDirty: boolean;
  handleReset: () => void;
} & Pick<UseFormReturn<EditProjectFormSchema>, "control" | "handleSubmit">;

export const useEditProjectForm = (project: Project): UseEditProjectFormReturn => {
  const { id, name, description, github_url, demo_url } = project;

  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, isDirty },
  } = useForm<EditProjectFormSchema>({
    resolver: zodResolver(editProjectFormSchema),
    defaultValues: {
      name,
      description,
      github_url,
      demo_url: demo_url || "",
    },
  });

  const onSubmit = async (data: EditProjectFormSchema) => {
    try {
      const result = await editProject(id, data);
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

      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Edit project error:", errorMessage);

      toast.error("Failed to edit project", { description: errorMessage });
    }
  };

  const handleReset = () => {
    reset({
      name,
      description,
      github_url,
      demo_url: demo_url || "",
    });
  };

  return { onSubmit, isSubmitting, isDirty, control, handleSubmit, handleReset };
};
