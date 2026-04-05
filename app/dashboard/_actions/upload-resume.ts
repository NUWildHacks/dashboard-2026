"use server";

import { uploadUserResume } from "@/lib/google-drive.lib";
import { ActionResult, User } from "@/types";

import { MAX_FILE_SIZE } from "../constants";

export async function uploadResumeAction(firstName: User["first_name"], lastName: User["last_name"], resume: File): Promise<ActionResult> {
  const filename = `${firstName} ${lastName} - Resume.pdf`;

  if (resume.type !== "application/pdf") return { success: false, error: "Only PDFs are allowed" };
  if (resume.size > MAX_FILE_SIZE) return { success: false, error: "File exceeds 5MB limit" };

  const buffer = Buffer.from(await resume.arrayBuffer());
  await uploadUserResume(buffer, filename);

  return { success: true };
}
