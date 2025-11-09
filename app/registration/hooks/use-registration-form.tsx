import { zodResolver } from "@hookform/resolvers/zod";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { FirestoreError } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { db } from "@/config/firebase-client";
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

      mlh_code_of_conduct: false,
      mlh_privacy_policy: false,
      mlh_marketing: false,
    },
  });

  const onSubmit = async (data: RegistrationFormSchema) => {
    try {
      const now = Date.now();

      const user: User = {
        id: userId,
        ...data,
        role: "Participant",
        status: "Attending",
        created_at: Timestamp.fromMillis(now),
        updated_at: Timestamp.fromMillis(now),
      };

      await setDoc(doc(db, "users", userId), user);

      router.replace("/dashboard");
    } catch (e) {
      const errorMessage = e instanceof FirestoreError ? e.message : "An unknown error occurred";
      //TODO: trigger toast pop up
      console.error(errorMessage);
    }
  };

  return { form, onSubmit };
}
