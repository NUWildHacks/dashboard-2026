"use server";

import { getFirestore } from "firebase-admin/firestore";

import { PROJECTS_COLLECTION } from "@/constants/db.constants";
import User from "@/types/user.types";

export async function getProjectDocSnapshot(projectId: User["project_id"]) {
  if (!projectId) return;

  const db = getFirestore();

  const projectDocRef = db.collection(PROJECTS_COLLECTION).doc(projectId);

  const projectDocSnapshot = await projectDocRef.get();

  return projectDocSnapshot;
}
