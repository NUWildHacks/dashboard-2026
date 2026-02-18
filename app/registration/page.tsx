import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import { DASHBOARD_PATH, JUDGE, LOGIN_PATH, MENTOR, USERS_COLLECTION } from "@/constants";
import { getConfigDocSnapshot, verifySession } from "@/lib";
import type { JudgeUser, WildHacksConfig } from "@/types";

import RegistrationForm from "./_components/registration-form";

const getCurrentTimestamp = () => Date.now();

const RegistrationPage = async () => {
  const userInfo = await verifySession();
  if (!userInfo) redirect(LOGIN_PATH);

  const { id, email } = userInfo;

  const db = getFirestore();
  const userDocSnapshotById = await db.collection(USERS_COLLECTION).doc(id).get();
  if (userDocSnapshotById.exists) redirect(DASHBOARD_PATH);

  const userDocSnapshotByEmail = await db.collection(USERS_COLLECTION).where("email", "==", email).limit(1).get();
  if (!userDocSnapshotByEmail.empty) {
    const newJudgeDocRef = db.collection(USERS_COLLECTION).doc(id);

    const data = userDocSnapshotByEmail.docs[0].data();

    if (data?.role === JUDGE || data?.role === MENTOR) {
      const timestamp = getCurrentTimestamp();

      await db.runTransaction(async (transaction) => {
        transaction.set(newJudgeDocRef, {
          ...data,
          created_at: timestamp,
          updated_at: timestamp,
        } as JudgeUser);

        transaction.delete(userDocSnapshotByEmail.docs[0].ref);
      });

      redirect(DASHBOARD_PATH);
    }
  }

  const configDocSnapshot = await getConfigDocSnapshot();
  const wildhacksConfig = configDocSnapshot.data() as WildHacksConfig;

  return (
    <main className="flex-1 px-6 sm:px-12 py-12 flex flex-col justify-center items-center">
      <div className="max-w-[650px]">
        <div className="text-center space-y-12">
          <h2 className="text-4xl sm:text-5xl font-semibold">Hey there, future hacker! 👋</h2>
          <p>
            Fill out the registration form below and you&apos;ll be all set. We just need some basic info to get you
            started. This should only take a few minutes!
          </p>
          <RegistrationForm userEmail={email} {...wildhacksConfig} />
        </div>
      </div>
    </main>
  );
};

export default RegistrationPage;
