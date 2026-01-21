"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { createProject } from "../_actions";
import { createProjectFormSchema, type CreateProjectFormSchema } from "../_schemas";

export type UseCreateNewProjectDialogReturn = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit: SubmitHandler<CreateProjectFormSchema>;
  isSubmitting: boolean;
} & Pick<UseFormReturn<CreateProjectFormSchema>, "control" | "handleSubmit">;

export const useCreateProjectDialog = (): UseCreateNewProjectDialogReturn => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<CreateProjectFormSchema>({
    resolver: zodResolver(createProjectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      github_url: "",
    },
  });

  const onSubmit = async (data: CreateProjectFormSchema) => {
    try {
      const result = await createProject(data);
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

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Create project error:", errorMessage);

      toast.error("Failed to create project", { description: errorMessage });
    }
  };

  return { onSubmit, isSubmitting, control, handleSubmit, isOpen, setIsOpen };
};
