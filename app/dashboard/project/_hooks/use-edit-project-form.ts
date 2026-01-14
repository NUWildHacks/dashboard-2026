"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import type { Project } from "@/app/dashboard/project/_types";
import { db } from "@/config/firebase-client";
import { PROJECTS_COLLECTION } from "@/constants";

import { editProjectFormSchema, EditProjectFormSchema } from "../_schemas";

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
      const now = Date.now();

      const { name, description, github_url, demo_url } = data;

      const projectDocRef = doc(db, PROJECTS_COLLECTION, id);

      await updateDoc(projectDocRef, {
        name,
        description,
        github_url,
        demo_url,
        updated_at: now,
      });

      router.refresh();
    } catch (e) {
      const errorMessage = e instanceof FirebaseError || e instanceof Error ? e.message : "An unknown error occurred";
      console.error(errorMessage);

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
