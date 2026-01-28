"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { createPermissionCode } from "../_actions";
import { createPermissionCodeDialogSchema, type CreatePermissionCodeDialogSchema } from "../_schemas";

export type UseCreatePermissionCodeDialogReturn = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: SubmitHandler<CreatePermissionCodeDialogSchema>;
  isSubmitting: boolean;
} & Pick<UseFormReturn<CreatePermissionCodeDialogSchema>, "control" | "handleSubmit">;

export const useCreatePermissionCodeDialog = (): UseCreatePermissionCodeDialogReturn => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting },
  } = useForm<CreatePermissionCodeDialogSchema>({
    resolver: zodResolver(createPermissionCodeDialogSchema),
    defaultValues: {
      email: "",
      type: undefined,
    },
  });

  const onSubmit = async (data: CreatePermissionCodeDialogSchema) => {
    try {
      const result = await createPermissionCode(data);
      const { success } = result;

      if (!success) {
        const { field, error } = result;

        if (field) {
          setError(field, {
            type: "server",
            message: error,
          });
        } else {
          toast.error("Failed to create permission code", { description: error });
        }
        return;
      }

      reset();
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Create permission code error:", errorMessage);

      toast.error("Failed to create permission code", { description: errorMessage });
    }
  };

  return {
    isOpen,
    setIsOpen,
    onSubmit,
    isSubmitting,
    control,
    handleSubmit,
  };
};
