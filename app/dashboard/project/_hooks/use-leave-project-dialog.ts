"use client";

import { useState } from "react";
import { toast } from "sonner";

import { leaveProject } from "../_actions";
import type { Project } from "../types";

export type UseLeaveProjectDialogReturn = {
  handleLeaveProject: (projectId: Project["id"]) => Promise<void>;
  isLoading: boolean;
};

export const useLeaveProjectDialog = (): UseLeaveProjectDialogReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLeaveProject = async (projectId: Project["id"]) => {
    setIsLoading(true);

    try {
      const result = await leaveProject(projectId);
      const { success } = result;

      if (!success) {
        const { error } = result;
        throw new Error(error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Leave project error:", errorMessage);

      toast.error("Failed to leave project", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLeaveProject, isLoading };
};
