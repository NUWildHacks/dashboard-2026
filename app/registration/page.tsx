import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import { DASHBOARD_PATH, LOGIN_PATH, USERS_COLLECTION } from "@/constants";
import { getConfigDocSnapshot, verifySession } from "@/lib";
import type { WildHacksConfig } from "@/types";

import RegistrationForm from "./_components/registration-form";

const RegistrationPage = async () => {
  const userId = await verifySession();
  if (!userId) redirect(LOGIN_PATH);

  const db = getFirestore();

  const userDocSnapshot = await db.collection(USERS_COLLECTION).doc(userId).get();
  if (userDocSnapshot.exists) redirect(DASHBOARD_PATH);

  const configDocSnapshot = await getConfigDocSnapshot();
  const wildhacksConfig = configDocSnapshot.data() as WildHacksConfig;

  return (
    <main className="flex-1 px-6 sm:px-12 py-6 flex flex-col justify-center items-center">
      <div className="max-w-[650px]">
        <div className="text-center space-y-5">
          <h2 className="text-4xl sm:text-5xl font-semibold">Hey there, future hacker! 👋</h2>
          <p>
            Fill out the registration form below and you&apos;ll be all set. We just need some basic info to get you
            started. This should only take a few minutes!
          </p>
          <RegistrationForm {...wildhacksConfig} />
        </div>
      </div>
    </main>
  );
};

export default RegistrationPage;
