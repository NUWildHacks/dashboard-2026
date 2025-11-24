import { zodResolver } from "@hookform/resolvers/zod";
import { deleteDoc, doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import { FirestoreError } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { db } from "@/config/firebase-client";
import { EVENT_COLLECTION, EVENT_STATISTICS_DOC, PERMISSION_CODES_COLLECTION, USERS_COLLECTION } from "@/constants/db";
import { ONGOING } from "@/constants/event";
import { DASHBOARD_PATH } from "@/constants/routes";
import { ATTENDING, PARTICIPANT } from "@/constants/user";
import { EventConfig } from "@/types/event";
import PermissionCode from "@/types/permission-code";
import User from "@/types/user";

import { RegistrationFormSchema, registrationFormSchema } from "../_schemas/registration-form-schema";

export type useRegistrationFormReturn = {
  onSubmit: SubmitHandler<RegistrationFormSchema>;
  isSubmitting: boolean;
} & Pick<UseFormReturn<RegistrationFormSchema>, "control" | "handleSubmit">;

export default function useRegistrationForm(userId: User["id"], eventState: EventConfig["state"]) {
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

      if (eventState === ONGOING) {
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

      const user: User = {
        id: userId,
        ...rest,
        role: PARTICIPANT,
        status: ATTENDING,
        created_at: now,
        updated_at: now,
      };

      const userDocRef = doc(db, USERS_COLLECTION, userId);
      await setDoc(userDocRef, user);

      const eventStatisticsDofRef = doc(db, EVENT_COLLECTION, EVENT_STATISTICS_DOC);
      await updateDoc(eventStatisticsDofRef, {
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
}
