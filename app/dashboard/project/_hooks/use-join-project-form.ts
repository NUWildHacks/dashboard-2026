import { zodResolver } from "@hookform/resolvers/zod";
import { FirebaseError } from "firebase/app";
import { arrayUnion, collection, doc, getDoc, getDocs, limit, query, updateDoc, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { db } from "@/config/firebase-client";
import { PROJECTS_COLLECTION, USERS_COLLECTION } from "@/constants/db";
import User from "@/types/user";
import { WildHacksConfig } from "@/types/wildhacks";

import { PROJECT_FIELDS } from "../_constants/project.constant";
import { joinProjectFormSchema, JoinProjectFormSchema } from "../_schemas/join-project-form.schema";
import { Project } from "../_types/project.type";

export type UseJoinProjectReturn = {
  onSubmit: SubmitHandler<JoinProjectFormSchema>;
  isSubmitting: boolean;
} & Pick<UseFormReturn<JoinProjectFormSchema>, "control" | "handleSubmit">;

const useJoinProjectForm = (
  userId: User["id"],
  max_team_size: WildHacksConfig["max_team_size"]
): UseJoinProjectReturn => {
  const router = useRouter();

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

      if ((projectDocQuerySnapshot.docs[0].data() as Omit<Project, "id">).members.length === max_team_size) {
        setError("join_code", { type: "validate", message: "The maximum team size has been reached for this project" });
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

      router.refresh();
    } catch (e) {
      const errorMessage = e instanceof FirebaseError || e instanceof Error ? e.message : "An unknown error occurred";
      console.error(errorMessage);

      toast.error("Failed to join project", { description: errorMessage });
    }
  };

  return { control, handleSubmit, onSubmit, isSubmitting };
};

export default useJoinProjectForm;
