"use server";

import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { revalidatePath } from "next/cache";

import { DASHBOARD_PATH, LOGIN_PATH, PARTICIPANT, RESUMES_COLLECTION } from "@/constants";
import { getAuthenticatedUser, requireRole } from "@/lib";
import { ActionResult } from "@/types";

import { MAX_FILE_SIZE, RESUME_MIME_TYPE } from "../constants";
import { ResumeMetadata } from "../types";

export const uploadResume = async (resume: File): Promise<ActionResult> => {
  const db = getFirestore();
  const storage = getStorage();

  const now = Date.now();

  if (resume.type !== RESUME_MIME_TYPE) return { success: false, error: "Only PDFs are allowed" };
  if (resume.size > MAX_FILE_SIZE) return { success: false, error: "File exceeds 5MB limit" };

  try {
    const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`;
    const user = await getAuthenticatedUser(redirectPath);
    const { id, first_name, last_name } = user;

    const roleError = requireRole(user, PARTICIPANT, "You are not authorized to upload a resume");
    if (roleError) return roleError;

    const bucket = storage.bucket();
    const newFileName = `${first_name} ${last_name} - Resume.pdf`;
    const newStoragePath = `gs://${bucket.name}/${newFileName}`;

    const resumeRef = db.collection(RESUMES_COLLECTION).doc(id);
    const resumeDocSnapshot = await resumeRef.get();

    if (resumeDocSnapshot.exists) {
      const { storage_path: oldStoragePath, file_name: oldFileName } = resumeDocSnapshot.data() as Omit<
        ResumeMetadata,
        "id"
      >;

      if (oldStoragePath !== newStoragePath) {
        await bucket.file(oldFileName).delete();
      }
    }

    const buffer = Buffer.from(await resume.arrayBuffer());
    await bucket.file(newFileName).save(buffer, {
      metadata: {
        contentType: RESUME_MIME_TYPE,
        uploadedBy: id,
        originalFileName: resume.name,
      },
    });

    if (resumeDocSnapshot.exists) {
      await resumeRef.update({
        file_name: newFileName,
        storage_path: newStoragePath,
        content_type: resume.type,
        updated_at: now,
      } as Omit<ResumeMetadata, "id" | "created_at">);
    } else {
      await resumeRef.set({
        file_name: newFileName,
        storage_path: newStoragePath,
        content_type: resume.type,
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
