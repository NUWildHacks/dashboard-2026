import { zodResolver } from "@hookform/resolvers/zod";
import { Timestamp, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { FirestoreError } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { db } from "@/config/firebase-client";
import { PERMISSION_CODES_COLLECTION, USERS_COLLECTION } from "@/constants/db";
import { DASHBOARD_PATH } from "@/constants/routes";
import { ATTENDING, PARTICIPANT } from "@/constants/user";
import PermissionCode from "@/types/permission-code";
import User from "@/types/user";

import { RegistrationFormSchema, registrationFormSchema } from "../schemas/registration-form-schema";

export default function useRegistrationForm(userId: User["id"]) {
  const router = useRouter();

  const form = useForm<RegistrationFormSchema>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      country: "",

      school: "",
      level_of_study: "",
      field_of_study: "",

      github_username: "",
      tshirt_size: "",

      gender: "",
      race: "",
      dietary_restrictions: "", // TODO: Array for multi-select
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

      const permissionCodeDocRef = doc(db, PERMISSION_CODES_COLLECTION, permission_code);
      const permissionCodeDocSnap = await getDoc(permissionCodeDocRef);

      if (!permissionCodeDocSnap.exists() || (permissionCodeDocSnap.data() as PermissionCode).email !== rest.email) {
        form.setError("permission_code", { type: "validate", message: "Invalid permission code" });
        return;
      }

      await deleteDoc(permissionCodeDocRef);

      const user: User = {
        id: userId,
        ...rest,
        date_of_birth: Timestamp.fromDate(new Date(rest.date_of_birth)),
        role: PARTICIPANT,
        status: ATTENDING,
        created_at: Timestamp.fromMillis(now),
        updated_at: Timestamp.fromMillis(now),
      };

      const userDocRef = doc(db, USERS_COLLECTION, userId);
      await setDoc(userDocRef, user);

      router.replace(DASHBOARD_PATH);
    } catch (e) {
      const errorMessage = e instanceof FirestoreError || e instanceof Error ? e.message : "An unknown error occurred";
      //TODO: trigger toast pop up
      console.error(errorMessage);
    }
  };

  return { form, onSubmit };
}
