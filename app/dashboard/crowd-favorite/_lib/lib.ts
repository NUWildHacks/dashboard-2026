"use server";

import { getFirestore } from "firebase-admin/firestore";

import {
  CROWD_FAVORITES_COLLECTION,
  CROWD_FAVORITE_VOTES_SUBCOLLECTION,
  PARTICIPANT,
  USERS_COLLECTION,
} from "@/constants";
import type { CrowdFavoriteProject, ParticipantUser } from "@/types";

type CrowdFavoriteProjectWithVotes = CrowdFavoriteProject & {
  vote_count: number;
};

const getCrowdFavoriteProject = async (projectId: string): Promise<CrowdFavoriteProject | null> => {
  const db = getFirestore();

  const projectDocSnapshot = await db.collection(CROWD_FAVORITES_COLLECTION).doc(projectId).get();
  if (!projectDocSnapshot.exists) return null;

  return {
    id: projectDocSnapshot.id,
    ...(projectDocSnapshot.data() as Omit<CrowdFavoriteProject, "id">),
  };
};

const getCrowdFavoriteProjectForUser = async (userId: string): Promise<CrowdFavoriteProject | null> => {
  const db = getFirestore();

  const snap = await db
    .collection(CROWD_FAVORITES_COLLECTION)
    .where("team_member_ids", "array-contains", userId)
    .limit(1)
    .get();
  if (snap.empty) return null;

  const doc = snap.docs[0];
  return { id: doc.id, ...(doc.data() as Omit<CrowdFavoriteProject, "id">) };
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

const getCrowdFavoriteProjectsWithVoteCount = async (
  includeVotes: boolean
): Promise<CrowdFavoriteProjectWithVotes[]> => {
  const projects = await getAllCrowdFavoriteProjects();
  if (!includeVotes) {
    return projects
      .map((project) => ({
        ...project,
        vote_count: 0,
      }))
      .sort((a, b) => a.created_at - b.created_at);
  }

  const db = getFirestore();

  const projectVoteCounts = await Promise.all(
    projects.map(async (project) => {
      const voteSnapshot = await db
        .collection(CROWD_FAVORITES_COLLECTION)
        .doc(project.id)
        .collection(CROWD_FAVORITE_VOTES_SUBCOLLECTION)
        .count()
        .get();

      return {
        ...project,
        vote_count: voteSnapshot.data().count,
      };
    })
  );

  return projectVoteCounts.sort((a, b) => {
    if (b.vote_count !== a.vote_count) {
      return b.vote_count - a.vote_count;
    }

    return a.created_at - b.created_at;
  });
};

const getUserVotedProjectId = async (userId: string): Promise<string | null> => {
  const db = getFirestore();

  try {
    const voteSnap = await db
      .collectionGroup(CROWD_FAVORITE_VOTES_SUBCOLLECTION)
      .where("id", "==", userId)
      .limit(1)
      .get();

    if (voteSnap.empty) return null;
    return voteSnap.docs[0].ref.parent.parent?.id ?? null;
  } catch {
    return null;
  }
};

export {
  getAllCrowdFavoriteProjects,
  getAllParticipantUsers,
  getCrowdFavoriteProject,
  getCrowdFavoriteProjectForUser,
  getCrowdFavoriteProjectsWithVoteCount,
  getUserVotedProjectId,
};
export type { CrowdFavoriteProjectWithVotes };
