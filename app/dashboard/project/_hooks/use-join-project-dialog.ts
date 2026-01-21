"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { joinProject } from "../_actions";
import { joinProjectFormSchema, type JoinProjectFormSchema } from "../_schemas";

export type UseJoinProjectDialogReturn = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: SubmitHandler<JoinProjectFormSchema>;
  isSubmitting: boolean;
} & Pick<UseFormReturn<JoinProjectFormSchema>, "control" | "handleSubmit">;

export const useJoinProjectDialog = (): UseJoinProjectDialogReturn => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<JoinProjectFormSchema>({
    resolver: zodResolver(joinProjectFormSchema),
    defaultValues: {
      invitation_code: "",
    },
  });

  const onSubmit = async (data: JoinProjectFormSchema) => {
    try {
      const result = await joinProject(data);
      const { success } = result;

      if (!success) {
        const { field, error } = result;

        if (!field) {
          throw new Error(error);
        }

        setError(field, {
          type: "server",
          message: error,
        });
        return;
      }

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Join project error:", errorMessage);

      toast.error("Failed to join project", { description: errorMessage });
    }
  };

  return { control, handleSubmit, onSubmit, isSubmitting, isOpen, setIsOpen };
};
