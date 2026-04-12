"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { submitCrowdFavoriteVote } from "../_actions";
import { crowdFavoriteVoteFormSchema, type CrowdFavoriteVoteFormSchema } from "../_schemas/vote-form.schemas";

type VotingProjectOption = {
  id: string;
  project_name: string;
};

type UseCrowdFavoriteVoteFormProps = {
  projects: VotingProjectOption[];
  initialVotedProjectId?: string;
};

const useCrowdFavoriteVoteForm = ({ projects, initialVotedProjectId }: UseCrowdFavoriteVoteFormProps) => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<CrowdFavoriteVoteFormSchema>({
    resolver: zodResolver(crowdFavoriteVoteFormSchema),
    defaultValues: {
      crowd_favorite_password: "",
      selected_project_id: initialVotedProjectId ?? "",
    },
  });

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState<CrowdFavoriteVoteFormSchema | null>(null);
  const [currentVotedProjectId, setCurrentVotedProjectId] = useState<string | null>(initialVotedProjectId ?? null);
  const [isEditingVote, setIsEditingVote] = useState(!initialVotedProjectId);

  const currentVotedProjectName = useMemo(() => {
    if (!currentVotedProjectId) return null;
    const project = projects.find((item) => item.id === currentVotedProjectId);
    return project?.project_name ?? null;
  }, [currentVotedProjectId, projects]);

  const onPrepareSubmit = (data: CrowdFavoriteVoteFormSchema) => {
    setPendingSubmission(data);
    setIsConfirmDialogOpen(true);
  };

  const onConfirmSubmit = async () => {
    if (!pendingSubmission) return;

    const result = await submitCrowdFavoriteVote(pendingSubmission);

    if (!result.success) {
      if (result.field) {
        setError(result.field, {
          type: "server",
          message: result.error,
        });
      }

      toast.error("Could not submit your vote", { description: result.error });
      return;
    }

    toast.success("Vote saved", {
      description: "You can still edit your vote while the voting window is open.",
    });

    setCurrentVotedProjectId(pendingSubmission.selected_project_id);
    setIsEditingVote(false);
    setPendingSubmission(null);
    setIsConfirmDialogOpen(false);

    reset({
      crowd_favorite_password: "",
      selected_project_id: pendingSubmission.selected_project_id,
    });

    router.refresh();
  };

  const handleEditVote = () => {
    setIsEditingVote(true);
    reset({
      crowd_favorite_password: "",
      selected_project_id: currentVotedProjectId ?? "",
    });
  };

  return {
    control,
    handleSubmit,
    isSubmitting,
    isDirty,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    onPrepareSubmit,
    onConfirmSubmit,
    isEditingVote,
    handleEditVote,
    currentVotedProjectName,
  };
};

export { useCrowdFavoriteVoteForm };
