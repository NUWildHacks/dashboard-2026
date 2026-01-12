import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

import { db } from "@/config/firebase-client";
import { USERS_COLLECTION } from "@/constants/db.constants";
import { USER_FIELDS } from "@/constants/user.constants";

import { Project } from "../_types/project.types";
import { TeamMember } from "../_types/team-member.types";

export type UseTeamMembersListReturn = {
  teamMembers: TeamMember[];
  isLoading: boolean;
};

const useTeamMembersList = (projectId: Project["id"]): UseTeamMembersListReturn => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const q = query(
      collection(db, USERS_COLLECTION),
      where(USER_FIELDS.project_id, "==", projectId),
      orderBy(USER_FIELDS.last_name, "desc")
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

export default useTeamMembersList;
