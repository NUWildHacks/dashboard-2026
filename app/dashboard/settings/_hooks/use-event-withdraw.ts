"use client";

import { FirebaseError } from "firebase/app";
import {
  collection,
  deleteDoc,
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
import { ROOT_PATH } from "@/constants/routes.constants";
import { USER_FIELDS } from "@/constants/user.constants";
import User from "@/types/user.types";

import { Project } from "../../project/_types/project.types";

export type UseEventWithdrawReturn = {
  isWithdrawing: boolean;
  withdraw: () => Promise<void>;
};

const useEventWithdraw = (userId: User["id"]): UseEventWithdrawReturn => {
  const router = useRouter();

  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const withdraw = async () => {
    setIsWithdrawing(true);

    try {
      const now = Date.now();

      const statisticsDocRef = doc(db, WILDHACKS_COLLECTION, WILDHACKS_STATISTICS_DOC);

      const userDocRef = doc(db, USERS_COLLECTION, userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (!userDocSnapshot.exists()) {
        toast.error("Failed to withdraw from event", { description: "User not found" });
        return;
      }

      const { project_id } = userDocSnapshot.data() as Omit<User, "id">;

      if (project_id) {
        const projectDocRef = doc(db, PROJECTS_COLLECTION, project_id);
        const projectDocSnapshot = await getDoc(projectDocRef);

        if (!projectDocSnapshot.exists()) {
          toast.error("Failed to leave project", { description: "Project not found" });
          return;
        }

        const project = projectDocSnapshot.data() as Omit<Project, "id">;
        const isOwner = project.owner_id === userId;

        const q = query(
          collection(db, USERS_COLLECTION),
          where(USER_FIELDS.project_id, "==", project_id),
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
            owner_id: newOwnerId as User["id"],
            updated_at: now,
          } as Pick<Project, "owner_id" | "updated_at">);
        }
      }

      await deleteDoc(userDocRef);
      await updateDoc(statisticsDocRef, {
        participants: increment(-1),
        updated_at: now,
      });

      router.replace(ROOT_PATH);
    } catch (e) {
      const errorMessage = e instanceof FirebaseError || e instanceof Error ? e.message : "An unknown error occurred";
      console.error(errorMessage);

      toast.error("Failed to withdraw from event", { description: errorMessage });
    } finally {
      setIsWithdrawing(false);
    }
  };

  return {
    isWithdrawing,
    withdraw,
  };
};

export default useEventWithdraw;
