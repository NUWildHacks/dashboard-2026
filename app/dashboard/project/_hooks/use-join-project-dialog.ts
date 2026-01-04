import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { collection, doc, getDoc, getDocs, limit, query, updateDoc, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { db } from "@/config/firebase-client";
import { PROJECTS_COLLECTION, USERS_COLLECTION } from "@/constants/db.constants";
import User from "@/types/user.types";

import { PROJECT_FIELDS } from "../_constants/project.constants";
import { joinProjectFormSchema, JoinProjectFormSchema } from "../_schemas/join-project-form.schemas";

export type UseJoinProjectDialogReturn = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: SubmitHandler<JoinProjectFormSchema>;
  isSubmitting: boolean;
} & Pick<UseFormReturn<JoinProjectFormSchema>, "control" | "handleSubmit">;

const useJoinProjectDialog = (userId: User["id"]): UseJoinProjectDialogReturn => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<JoinProjectFormSchema>({
    resolver: zodResolver(joinProjectFormSchema),
    defaultValues: {
      invitation_code: "",
    },
  });

  const onSubmit = async (data: JoinProjectFormSchema) => {
    try {
      const now = Date.now();

      const { invitation_code } = data;

      const userDocRef = doc(db, USERS_COLLECTION, userId);
      const userDocSnapshot = await getDoc(userDocRef);

      const { project_id } = userDocSnapshot.data() as Omit<User, "id">;

      if (project_id) {
        setError("invitation_code", { type: "validate", message: "You already have a project" });
        return;
      }

      const projectDocQuery = query(
        collection(db, PROJECTS_COLLECTION),
        where(PROJECT_FIELDS.invitation_code, "==", invitation_code),
        limit(1)
      );
      const projectDocQuerySnapshot = await getDocs(projectDocQuery);

      if (projectDocQuerySnapshot.empty) {
        setError("invitation_code", { type: "validate", message: "Invalid invitation code" });
        return;
      }

      await updateDoc(userDocRef, {
        project_id: projectDocQuerySnapshot.docs[0].id,
        joined_project_at: now,
        updated_at: now,
      } as Pick<User, "project_id" | "joined_project_at" | "updated_at">);

      setIsOpen(false);

      router.refresh();
    } catch (e) {
      const errorMessage = e instanceof FirebaseError || e instanceof Error ? e.message : "An unknown error occurred";
      console.error(errorMessage);

      toast.error("Failed to join project", { description: errorMessage });
    }
  };

  return { control, handleSubmit, onSubmit, isSubmitting, isOpen, setIsOpen };
};

export default useJoinProjectDialog;
