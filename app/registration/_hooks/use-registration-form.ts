import { zodResolver } from "@hookform/resolvers/zod";
import { deleteDoc, doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import { FirestoreError } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { db } from "@/config/firebase-client";
import {
  WILDHACKS_COLLECTION,
  PERMISSION_CODES_COLLECTION,
  USERS_COLLECTION,
  WILDHACKS_STATISTICS_DOC,
} from "@/constants/db.constants";
import { DASHBOARD_PATH } from "@/constants/routes.constants";
import { PARTICIPANT } from "@/constants/user.constants";
import { ONGOING } from "@/constants/wildhacks.constants";
import User from "@/types/user.types";
import { WildHacksConfig } from "@/types/wildhacks.types";

import { RegistrationFormSchema, registrationFormSchema } from "../_schemas/registration-form.schemas";
import PermissionCode from "../_types/permission-code.types";

export type UseRegistrationFormReturn = {
  onSubmit: SubmitHandler<RegistrationFormSchema>;
  isSubmitting: boolean;
} & Pick<UseFormReturn<RegistrationFormSchema>, "control" | "handleSubmit">;

const useRegistrationForm = (userId: User["id"], state: WildHacksConfig["state"]): UseRegistrationFormReturn => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<RegistrationFormSchema>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      age: "",
      country: "",

      school: "",
      level_of_study: "",
      field_of_study: "",

      github_username: "",
      tshirt_size: "",

      gender: "",
      race: "",
      dietary_restrictions: [],
      other_dietary_restrictions: "",

      permission_code: "",

      mlh_code_of_conduct: false,
      mlh_privacy_policy: false,
      mlh_marketing: false,
    },
  });

  const onSubmit = async (data: RegistrationFormSchema) => {
    try {
      const now = Date.now();

      const { permission_code, ...rest } = data;

      if (state === ONGOING) {
        const permissionCodeDocRef = doc(db, PERMISSION_CODES_COLLECTION, permission_code);
        const permissionCodeDocSnap = await getDoc(permissionCodeDocRef);

        if (!permissionCodeDocSnap.exists()) {
          setError("permission_code", { type: "validate", message: "Invalid permission code" });
          return;
        }

        const { email, expires_at } = permissionCodeDocSnap.data() as PermissionCode;

        if (email !== rest.email) {
          setError("permission_code", { type: "validate", message: "Invalid permission code" });
          return;
        }

        if (expires_at <= now) {
          setError("permission_code", { type: "validate", message: "Expired permission code" });
          return;
        }

        await deleteDoc(permissionCodeDocRef);
      }

      const userDocRef = doc(db, USERS_COLLECTION, userId);
      await setDoc(userDocRef, { ...rest, role: PARTICIPANT, created_at: now, updated_at: now });

      const statisticsDocRef = doc(db, WILDHACKS_COLLECTION, WILDHACKS_STATISTICS_DOC);
      await updateDoc(statisticsDocRef, {
        participants: increment(1),
        updated_at: now,
      });

      router.replace(DASHBOARD_PATH);
    } catch (e) {
      const errorMessage = e instanceof FirestoreError || e instanceof Error ? e.message : "An unknown error occurred";
      console.error(errorMessage);

      toast.error("Form submission failed", { description: errorMessage });
    }
  };

  return { control, handleSubmit, onSubmit, isSubmitting };
};

export default useRegistrationForm;
