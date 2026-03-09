import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import { DASHBOARD_PATH, JUDGE, MENTOR, USERS_COLLECTION } from "@/constants";
import { JudgeUser, User } from "@/types";

const getCurrentTimestamp = () => Date.now();

const registerJudgeMentorWithEmail = async (userId: User["id"], userEmail: User["email"]) => {
  const db = getFirestore();
  const userDocSnapshotById = await db.collection(USERS_COLLECTION).doc(userId).get();
  if (userDocSnapshotById.exists) redirect(DASHBOARD_PATH);

  const userDocSnapshotByEmail = await db.collection(USERS_COLLECTION).where("email", "==", userEmail).limit(1).get();
  if (!userDocSnapshotByEmail.empty) {
    const newJudgeDocRef = db.collection(USERS_COLLECTION).doc(userId);

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
};

export { registerJudgeMentorWithEmail };
