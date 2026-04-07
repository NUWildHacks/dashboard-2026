"use server";

import { getFirestore } from "firebase-admin/firestore";

import { CROWD_FAVORITES_COLLECTION, PARTICIPANT, USERS_COLLECTION } from "@/constants";
import type { CrowdFavoriteProject, ParticipantUser } from "@/types";

const getCrowdFavoriteProject = async (projectId: string): Promise<CrowdFavoriteProject | null> => {
  const db = getFirestore();

  const projectDocSnapshot = await db.collection(CROWD_FAVORITES_COLLECTION).doc(projectId).get();
  if (!projectDocSnapshot.exists) return null;

  return {
    id: projectDocSnapshot.id,
    ...(projectDocSnapshot.data() as Omit<CrowdFavoriteProject, "id">),
  };
};

const getAllParticipantUsers = async (): Promise<ParticipantUser[]> => {
  const db = getFirestore();

  const participantDocSnapshots = await db.collection(USERS_COLLECTION).where("role", "==", PARTICIPANT).get();

  return participantDocSnapshots.docs
    .filter((doc) => doc.data().first_name)
    .map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<ParticipantUser, "id">),
    }));
};

const getAllCrowdFavoriteProjects = async (): Promise<CrowdFavoriteProject[]> => {
  const db = getFirestore();

  const crowdFavoriteDocSnapshots = await db.collection(CROWD_FAVORITES_COLLECTION).get();

  return crowdFavoriteDocSnapshots.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<CrowdFavoriteProject, "id">),
  }));
};

export { getAllCrowdFavoriteProjects, getAllParticipantUsers, getCrowdFavoriteProject };
