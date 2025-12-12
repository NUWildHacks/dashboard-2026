"use server";

import { getFirestore } from "firebase-admin/firestore";

import { USERS_COLLECTION } from "@/constants/db.constants";
import User from "@/types/user.types";

export async function getUserDocSnapshot(userId: User["id"]) {
  const db = getFirestore();

  const userDocRef = db.collection(USERS_COLLECTION).doc(userId);

  const userDocSnapshot = await userDocRef.get();

  return userDocSnapshot;
}
