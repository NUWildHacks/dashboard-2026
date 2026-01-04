"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, UseFormReset, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { db } from "@/config/firebase-client";
import { PROJECTS_COLLECTION } from "@/constants/db.constants";

import { editProjectFormSchema, EditProjectFormSchema } from "../_schemas/edit-project-form.schemas";
import { Project } from "../_types/project.types";

export type UseEditProjectFormReturn = {
  onSubmit: SubmitHandler<EditProjectFormSchema>;
  isSubmitting: boolean;
  handleReset: () => void;
} & Pick<UseFormReturn<EditProjectFormSchema>, "control" | "handleSubmit">;

const useEditProjectForm = (project: Project): UseEditProjectFormReturn => {
  const { id, name, description, github_url, demo_url } = project;

  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
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
      console.log(data);

      const projectDocRef = doc(db, PROJECTS_COLLECTION, id);

      await updateDoc(projectDocRef, {
        name,
        description,
        github_url,
        demo_url,
        created_at: now,
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
    reset(project);
  };

  return { onSubmit, isSubmitting, control, handleSubmit, handleReset };
};

export default useEditProjectForm;
