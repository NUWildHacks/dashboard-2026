import { FirebaseError } from "firebase/app";
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { db } from "@/config/firebase-client";
import {
  PROJECTS_COLLECTION,
  USERS_COLLECTION,
  WILDHACKS_COLLECTION,
  WILDHACKS_STATISTICS_DOC,
} from "@/constants/db.constants";
import { USER_FIELDS } from "@/constants/user.constants";
import User from "@/types/user.types";

import { Project } from "../_types/project.types";

export type UseLeaveProjectDialogReturn = {
  handleLeaveProject: () => Promise<void>;
  isLoading: boolean;
};

const useLeaveProjectDialog = (userId: User["id"], projectId: Project["id"]): UseLeaveProjectDialogReturn => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLeaveProject = async () => {
    setIsLoading(true);

    try {
      const now = Date.now();

      const projectDocRef = doc(db, PROJECTS_COLLECTION, projectId);
      const projectDocSnapshot = await getDoc(projectDocRef);

      if (!projectDocSnapshot.exists()) {
        toast.error("Failed to leave project", { description: "Project not found" });
        return;
      }

      const project = projectDocSnapshot.data() as Omit<Project, "id">;
      const isOwner = project.owner_id === userId;

      const userDocRef = doc(db, USERS_COLLECTION, userId);

      await updateDoc(userDocRef, {
        project_id: deleteField(),
        joined_project_at: deleteField(),
        updated_at: now,
      });

      const q = query(
        collection(db, USERS_COLLECTION),
        where(USER_FIELDS.project_id, "==", projectId),
        orderBy(USER_FIELDS.joined_project_at, "asc")
      );
      const remainingTeamMemberDocs = await getDocs(q);

      if (remainingTeamMemberDocs.size === 0) {
        const statisticsDocRef = doc(db, WILDHACKS_COLLECTION, WILDHACKS_STATISTICS_DOC);

        const deleteProjectDocPromise = deleteDoc(projectDocRef);
        const updateStatisticsDocPromise = updateDoc(statisticsDocRef, {
          projects: increment(-1),
          updated_at: now,
        });

        await Promise.all([deleteProjectDocPromise, updateStatisticsDocPromise]);
      } else if (isOwner) {
        const newOwnerId = remainingTeamMemberDocs.docs[0].id;

        await updateDoc(projectDocRef, {
          owner_id: newOwnerId,
          updated_at: now,
        } as Pick<Project, "owner_id" | "updated_at">);
      }

      router.refresh();
    } catch (e) {
      const errorMessage = e instanceof FirebaseError || e instanceof Error ? e.message : "An unknown error occurred";
      console.error(errorMessage);

      toast.error("Failed to leave project", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLeaveProject, isLoading };
};

export default useLeaveProjectDialog;
