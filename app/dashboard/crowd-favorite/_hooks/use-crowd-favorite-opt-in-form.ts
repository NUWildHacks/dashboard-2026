"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { optInToCrowdFavorite, verifyTeamMemberEmail, type VerifyTeamMemberEmailResult } from "../_actions";
import { crowdFavoriteOptInFormSchema, type CrowdFavoriteOptInFormSchema } from "../_schemas";
import { CROWD_FAVORITE_MAX_ADDITIONAL_MEMBERS } from "../constants";

type ValidatedTeamMember = {
  first_name: string;
  email: string;
};

type UseCrowdFavoriteOptInFormProps = {
  callerFirstName: string;
  callerEmail: string;
};

const useCrowdFavoriteOptInForm = ({ callerFirstName, callerEmail }: UseCrowdFavoriteOptInFormProps) => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<CrowdFavoriteOptInFormSchema>({
    resolver: zodResolver(crowdFavoriteOptInFormSchema),
    defaultValues: {
      project_name: "",
      devpost_url: "",
      team_members: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "team_members",
  });

  const [validatedTeamMembers, setValidatedTeamMembers] = useState<ValidatedTeamMember[]>([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState<CrowdFavoriteOptInFormSchema | null>(null);
  const [isValidatingMembers, setIsValidatingMembers] = useState(false);

  const handleAddTeamMember = () => {
    if (fields.length >= CROWD_FAVORITE_MAX_ADDITIONAL_MEMBERS) {
      return;
    }

    append({ email: "" });
  };

  const handleReset = () => {
    reset({
      project_name: "",
      devpost_url: "",
      team_members: [],
    });
    setValidatedTeamMembers([]);
    setPendingSubmission(null);
    setIsConfirmDialogOpen(false);
  };

  const validateTeamMembers = async (
    data: CrowdFavoriteOptInFormSchema
  ): Promise<VerifyTeamMemberEmailResult[] | null> => {
    setIsValidatingMembers(true);

    try {
      const normalizedMembers = data.team_members.map((member) => member.email.trim().toLowerCase());

      if (normalizedMembers.length === 0) {
        setValidatedTeamMembers([]);
        return [];
      }

      const verificationResults = await Promise.all(normalizedMembers.map((email) => verifyTeamMemberEmail(email)));

      let hasError = false;

      verificationResults.forEach((result, index) => {
        if (!result.success) {
          hasError = true;
          setError(`team_members.${index}.email`, {
            type: "server",
            message: result.error,
          });
        }
      });

      if (hasError) {
        return null;
      }

      const nextValidatedTeamMembers = verificationResults
        .filter((result) => result.success)
        .map((result) => ({
          first_name: result.first_name,
          email: result.email,
        }));

      setValidatedTeamMembers(nextValidatedTeamMembers);

      return verificationResults;
    } finally {
      setIsValidatingMembers(false);
    }
  };

  const onPrepareSubmit = async (data: CrowdFavoriteOptInFormSchema) => {
    const verificationResults = await validateTeamMembers(data);
    if (verificationResults === null) return;

    setPendingSubmission(data);
    setIsConfirmDialogOpen(true);
  };

  const onConfirmSubmit = async () => {
    if (!pendingSubmission) return;

    const result = await optInToCrowdFavorite(pendingSubmission);

    if (!result.success) {
      if (result.field) {
        setError(result.field, {
          type: "server",
          message: result.error,
        });
      }

      toast.error("Could not submit crowd favorite opt-in", { description: result.error });
      return;
    }

    toast.success("Crowd favorite opt-in submitted", {
      description: "Your team has been opted in successfully.",
    });

    setIsConfirmDialogOpen(false);
    setPendingSubmission(null);
    router.refresh();
  };

  const displayedTeamMembers: ValidatedTeamMember[] = [
    {
      first_name: callerFirstName,
      email: callerEmail.toLowerCase(),
    },
    ...validatedTeamMembers,
  ];

  return {
    control,
    fields,
    handleSubmit,
    isSubmitting,
    isDirty,
    isValidatingMembers,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    onPrepareSubmit,
    onConfirmSubmit,
    handleAddTeamMember,
    handleReset,
    remove,
    displayedTeamMembers,
  };
};

export { useCrowdFavoriteOptInForm };
