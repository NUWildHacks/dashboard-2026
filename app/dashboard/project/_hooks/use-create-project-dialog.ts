import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { addDoc, collection, doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { db } from "@/config/firebase-client";
import {
  PROJECTS_COLLECTION,
  USERS_COLLECTION,
  WILDHACKS_COLLECTION,
  WILDHACKS_STATISTICS_DOC,
} from "@/constants/db.constants";
import User from "@/types/user.types";

import { createProjectFormSchema, CreateProjectFormSchema } from "../_schemas/create-project-form.schemas";

export type CreateNewProjectDialogReturn = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit: SubmitHandler<CreateProjectFormSchema>;
  isSubmitting: boolean;
} & Pick<UseFormReturn<CreateProjectFormSchema>, "control" | "handleSubmit">;

const useCreateProjectDialog = (userId: User["id"]): CreateNewProjectDialogReturn => {
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
      const now = Date.now();

      const { name, description, github_url } = data;

      const userDocRef = doc(db, USERS_COLLECTION, userId);
      const userDocSnapshot = await getDoc(userDocRef);

      const { project_id } = userDocSnapshot.data() as Omit<User, "id">;

      const statisticsDocRef = doc(db, WILDHACKS_COLLECTION, WILDHACKS_STATISTICS_DOC);

      if (project_id) {
        setError("root", { type: "validate", message: "You already have a project" });
        return;
      }

      // Generate a Firestore auto-ID for the join code without creating a document
      const join_code = doc(collection(db, PROJECTS_COLLECTION)).id;

      const projectDocRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
        name,
        description,
        join_code,
        github_url,
        created_at: now,
        updated_at: now,
      });

      const updateUserDocPromise = updateDoc(userDocRef, {
        project_id: projectDocRef.id,
        updated_at: now,
      });

      const updateStatisticsDocPromise = updateDoc(statisticsDocRef, {
        projects: increment(1),
        updated_at: now,
      });

      await Promise.all([updateUserDocPromise, updateStatisticsDocPromise]);

      setIsOpen(false);

      router.refresh();
    } catch (e) {
      const errorMessage = e instanceof FirebaseError || e instanceof Error ? e.message : "An unknown error occurred";
      console.error(errorMessage);

      toast.error("Failed to create project", { description: errorMessage });
    }
  };

  return { onSubmit, isSubmitting, control, handleSubmit, isOpen, setIsOpen };
};

export default useCreateProjectDialog;
