"use server";

import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { revalidatePath } from "next/cache";

import { DASHBOARD_PATH, LOGIN_PATH, PARTICIPANT, RESUMES_COLLECTION } from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import { ActionResult } from "@/types";

import { ResumeMetadata } from "../types";

export const deleteResume = async (): Promise<ActionResult> => {
  const db = getFirestore();
  const storage = getStorage();

  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);

    const roleError = requireRole(user, PARTICIPANT, "You are not authorized to delete a resume");
    if (roleError) return roleError;

    const bucket = storage.bucket();

    const resumeRef = db.collection(RESUMES_COLLECTION).doc(user.id);
    const resumeDocSnapshot = await resumeRef.get();

    if (!resumeDocSnapshot.exists) {
      return { success: false, error: "Resume not found" };
    }

    const { file_name } = resumeDocSnapshot.data() as Omit<ResumeMetadata, "id">;

    await bucket.file(file_name).delete();

    try {
      await resumeRef.delete();
    } catch (err) {
      console.error(`Firestore doc ${resumeRef.id} delete failed after storage delete — dangling document:`, err);
    }

    revalidatePath(DASHBOARD_PATH);

    return { success: true };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Delete resume error:", detailedError);

    const isProduction = process.env.APP_ENV === "production";
    const errorMessage = isProduction ? "An unknown error occurred. Please try again." : detailedError;

    return { success: false, error: errorMessage };
  }
};
