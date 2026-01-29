"use client";

import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

import type { Project, TeamMember } from "@/app/dashboard/project/_types";
import { db } from "@/config/firebase-client";
import { USERS_COLLECTION, PARTICIPANT_USER_FIELDS } from "@/constants";

export type UseTeamMembersListReturn = {
  teamMembers: TeamMember[];
  isLoading: boolean;
};

export const useTeamMembersList = (projectId: Project["id"]): UseTeamMembersListReturn => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const q = query(
      collection(db, USERS_COLLECTION),
      where(PARTICIPANT_USER_FIELDS.project_id, "==", projectId),
      orderBy(PARTICIPANT_USER_FIELDS.last_name, "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as TeamMember
        );

        setTeamMembers(docs);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching team members: ", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [projectId]);

  return { teamMembers, isLoading };
};
