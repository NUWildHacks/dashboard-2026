import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { arrayUnion, collection, doc, getDoc, getDocs, limit, query, updateDoc, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { db } from "@/config/firebase-client";
import { PROJECTS_COLLECTION, USERS_COLLECTION } from "@/constants/db.constants";
import User from "@/types/user.types";

import { PROJECT_FIELDS } from "../_constants/project.constants";
import { joinProjectFormSchema, JoinProjectFormSchema } from "../_schemas/join-project-form.schema";

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
      join_code: "",
    },
  });

  const onSubmit = async (data: JoinProjectFormSchema) => {
    try {
      const now = Date.now();

      const { join_code } = data;

      const userDocRef = doc(db, USERS_COLLECTION, userId);
      const userDocSnapshot = await getDoc(userDocRef);

      const { project_id } = userDocSnapshot.data() as Omit<User, "id">;

      if (project_id) {
        setError("join_code", { type: "validate", message: "You are already have a project" });
        return;
      }

      const projectDocQuery = query(
        collection(db, PROJECTS_COLLECTION),
        where(PROJECT_FIELDS.join_code, "==", join_code),
        limit(1)
      );
      const projectDocQuerySnapshot = await getDocs(projectDocQuery);

      if (projectDocQuerySnapshot.empty) {
        setError("join_code", { type: "validate", message: "Invalid join code" });
        return;
      }

      const updateUserDocPromise = updateDoc(userDocRef, {
        project_id: projectDocQuerySnapshot.docs[0].id,
        updated_at: now,
      });

      const updateProjectDocPromise = updateDoc(projectDocQuerySnapshot.docs[0].ref, {
        members: arrayUnion(userId),
        updated_at: now,
      });

      await Promise.all([updateUserDocPromise, updateProjectDocPromise]);

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
