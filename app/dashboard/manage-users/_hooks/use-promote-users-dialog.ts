"use client";

import { useState } from "react";
import { toast } from "sonner";

import type { User } from "@/types";

import { promoteUsers } from "../_actions";

export type UsePromoteUsersDialogReturn = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isPromoting: boolean;
  selectedUserIds: User["id"][];
  handleOpenPromoteDialog: (userIds: User["id"][]) => void;
  handlePromoteUsers: () => Promise<void>;
};

/**
 * State for the "Promote to participant" confirm dialog.
 *
 * @param onPromoted - Called with the promoted ids after a successful promotion (for example, to
 * unselect those rows)
 */
export const usePromoteUsersDialog = (
  onPromoted?: (userIds: User["id"][]) => void
): UsePromoteUsersDialogReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<
    User["id"][]
  >([]);

  const handleOpenPromoteDialog = (
    userIds: User["id"][]
  ) => {
    setSelectedUserIds(userIds);
    setIsOpen(true);
  };

  const handlePromoteUsers = async () => {
    setIsPromoting(true);

    try {
      const result = await promoteUsers(selectedUserIds);
      if (!result.success) throw new Error(result.error);

      const skipped =
        selectedUserIds.length - result.promoted;
      toast.success(
        `Promoted ${result.promoted} user(s) to participant`,
        skipped > 0
          ? {
              description: `${skipped} user(s) were skipped because they are no longer waitlisted.`,
            }
          : undefined
      );

      setIsOpen(false);
      setSelectedUserIds([]);
      onPromoted?.(selectedUserIds);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred";
      console.error("Promote users error:", errorMessage);

      toast.error("Failed to promote users", {
        description: errorMessage,
      });
    } finally {
      setIsPromoting(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    isPromoting,
    selectedUserIds,
    handleOpenPromoteDialog,
    handlePromoteUsers,
  };
};
