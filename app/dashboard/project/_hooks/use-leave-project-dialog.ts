"use client";

import { FirebaseError } from "firebase/app";
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import type { Project } from "@/app/dashboard/project/_types";
import { db } from "@/config/firebase-client";
import { PROJECTS_COLLECTION, USERS_COLLECTION, USER_FIELDS } from "@/constants";
import type { User } from "@/types";

export type UseLeaveProjectDialogReturn = {
  handleLeaveProject: () => Promise<void>;
  isLoading: boolean;
};

export const useLeaveProjectDialog = (userId: User["id"], projectId: Project["id"]): UseLeaveProjectDialogReturn => {
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
        await deleteDoc(projectDocRef);
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
