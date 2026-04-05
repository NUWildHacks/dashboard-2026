"use server";

import { getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";

import { DASHBOARD_PATH, RESUME_COLLECTION, RESUME_METADATA_DOC, USERS_COLLECTION } from "@/constants";
import { uploadFile } from "@/lib/google-drive.lib";
import { ActionResult, User } from "@/types";

import { MAX_FILE_SIZE } from "../constants";
import { ResumeMetadata } from "../types";

export const uploadResume = async (
  userId: User["id"],
  firstName: User["first_name"],
  lastName: User["last_name"],
  resume: File
): Promise<ActionResult> => {
  const db = getFirestore();

  const now = Date.now();

  const filename = `${firstName} ${lastName} - Resume.pdf`;

  if (resume.type !== "application/pdf") return { success: false, error: "Only PDFs are allowed" };
  if (resume.size > MAX_FILE_SIZE) return { success: false, error: "File exceeds 5MB limit" };

  try {
    const buffer = Buffer.from(await resume.arrayBuffer());
    const { file_id, web_view_link } = await uploadFile(buffer, filename);

    const resumeDocRef = db
      .collection(USERS_COLLECTION)
      .doc(userId)
      .collection(RESUME_COLLECTION)
      .doc(RESUME_METADATA_DOC);
    const resumeDocSnapshot = await resumeDocRef.get();

    if (resumeDocSnapshot.exists) {
      await resumeDocRef.update({
        file_id,
        web_view_link,
        file_name: filename,
        updated_at: now,
      } as Omit<ResumeMetadata, "id" | "created_at">);
    } else {
      await resumeDocRef.set({
        file_id,
        web_view_link,
        file_name: filename,
        created_at: now,
        updated_at: now,
      } as Omit<ResumeMetadata, "id">);
    }

    revalidatePath(DASHBOARD_PATH);

    return { success: true };
  } catch (error) {
    const detailedError = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Upload resume error:", detailedError);

    const isProduction = process.env.APP_ENV === "production";
    const errorMessage = isProduction ? "An unknown error occurred. Please try again." : detailedError;

    return { success: false, error: errorMessage };
  }
};
