import { zodResolver } from "@hookform/resolvers/zod";
import { doc, updateDoc, FirestoreError } from "firebase/firestore";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { db } from "@/config/firebase-client";
import { USERS_COLLECTION } from "@/constants/db.constants";
import User from "@/types/user.types";

import { editProfileFormSchema, EditProfileFormSchema } from "../_schemas/edit-profile-form.schemas";

export type UseEditProfileFormReturn = {
  onSubmit: SubmitHandler<EditProfileFormSchema>;
  isSubmitting: boolean;
  isDirty: boolean;
  handleReset: () => void;
} & Pick<UseFormReturn<EditProfileFormSchema>, "control" | "handleSubmit">;

const useEditProfileForm = (user: User): UseEditProfileFormReturn => {
  const { id, first_name, last_name, email, phone, github_username, dietary_restrictions, other_dietary_restrictions } =
    user;
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<EditProfileFormSchema>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: {
      first_name,
      last_name,
      email,
      phone,
      github_username,
      dietary_restrictions,
      other_dietary_restrictions,
    },
  });

  const onSubmit = async (data: EditProfileFormSchema) => {
    try {
      const now = Date.now();

      const { ...rest } = data;

      const userDocRef = doc(db, USERS_COLLECTION, id);
      await updateDoc(userDocRef, { ...rest, updated_at: now });
    } catch (e) {
      const errorMessage = e instanceof FirestoreError || e instanceof Error ? e.message : "An unknown error occurred";
      console.error(errorMessage);

      toast.error("Failed to update profile", { description: errorMessage });
    }
  };

  const handleReset = () => {
    reset();
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    isSubmitting,
    isDirty,
    handleReset,
  };
};

export default useEditProfileForm;
