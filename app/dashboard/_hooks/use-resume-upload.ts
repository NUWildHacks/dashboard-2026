"use client";

import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { ChangeEvent, RefObject, useRef, useState } from "react";
import { toast } from "sonner";

import { deleteResume } from "../_actions/delete-resume";
import { uploadResume } from "../_actions/upload-resume";

export type UseResumeUploadReturn = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  isUploading: boolean;
  isDeleting: boolean;
  handleOpenFileInput: () => void;
  handleUploadResume: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleDeleteResume: () => Promise<void>;
  handleDownloadResume: () => Promise<void>;
};

export const useResumeUpload = (fileName?: string): UseResumeUploadReturn => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUploadResume = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const result = await uploadResume(file);
      const { success } = result;

      if (!success) {
        const { error } = result;
        throw new Error(error);
      }

      toast.success("Resume uploaded successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error("Failed to upload resume", { description: errorMessage });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!fileName) return;

    setIsDeleting(true);

    try {
      const result = await deleteResume();
      const { success } = result;

      if (!success) {
        const { error } = result;
        throw new Error(error);
      }

      toast.success("Resume deleted successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast.error("Failed to delete resume", { description: errorMessage });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadResume = async () => {
    if (!fileName) return;

    const storage = getStorage();
    const fileRef = ref(storage, fileName);

    const url = await getDownloadURL(fileRef);

    window.open(url, "_blank");
  };

  return {
    fileInputRef,
    isUploading,
    isDeleting,
    handleOpenFileInput,
    handleUploadResume,
    handleDeleteResume,
    handleDownloadResume,
  };
};
