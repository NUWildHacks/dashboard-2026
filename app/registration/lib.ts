import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import { DASHBOARD_PATH, JUDGE, MENTOR, PARTICIPANT, USER_FIELDS, USERS_COLLECTION } from "@/constants";
import { JudgeUser, MentorUser, User } from "@/types";

const getCurrentTimestamp = () => Date.now();

/**
 * Registers a judge or mentor user by migrating their data from an email-based document
 * to a user ID-based document.
 *
 * This function performs the following operations:
 * 1. Checks if a user document with the given userId already exists (redirects if found)
 * 2. Searches for an existing user document by email
 * 3. If found and the user has JUDGE or MENTOR role, migrates the data:
 *    - Creates a new document using the userId as the document ID
 *    - Copies all user data (excluding id, created_at, updated_at)
 *    - Sets new timestamps for created_at and updated_at
 *    - Deletes the old email-based document
 * 4. Redirects to the dashboard after successful migration
 *
 * @param {User["id"]} userId - The unique identifier for the user document
 * @param {User["email"]} userEmail - The email address to search for existing user data
 * @throws {RedirectError} Redirects to DASHBOARD_PATH if user already exists or after successful migration
 * @async
 */
const registerJudgeMentorWithEmail = async (userId: User["id"], userEmail: User["email"]) => {
  const db = getFirestore();
  const userDocSnapshotById = await db.collection(USERS_COLLECTION).doc(userId).get();
  if (userDocSnapshotById.exists) {
    const userData = userDocSnapshotById.data()!;
    const isIncompleteParticipant =
      userData.role === PARTICIPANT &&
      userData.created_at > 1773205239000 &&
      !userData.first_name &&
      !userData.last_name;
    if (!isIncompleteParticipant) redirect(DASHBOARD_PATH);
    // Incomplete participant: skip email migration entirely and let them fill the form.
    // Running the email query here could accidentally migrate them to judge/mentor status.
    return;
  }

  const userDocSnapshotByEmail = await db
    .collection(USERS_COLLECTION)
    .where(USER_FIELDS.email, "==", userEmail)
    .limit(1)
    .get();
  if (!userDocSnapshotByEmail.empty) {
    const newJudgeDocRef = db.collection(USERS_COLLECTION).doc(userId);

    const data = userDocSnapshotByEmail.docs[0].data() as Omit<
      JudgeUser | MentorUser,
      "id" | "created_at" | "updated_at" | "onboarded"
    >;

    if (data?.role === JUDGE || data?.role === MENTOR) {
      const timestamp = getCurrentTimestamp();

      await db.runTransaction(async (transaction) => {
        transaction.set(newJudgeDocRef, {
          ...data,
          onboarded: false,
          created_at: timestamp,
          updated_at: timestamp,
        } as Omit<JudgeUser | MentorUser, "id">);

        transaction.delete(userDocSnapshotByEmail.docs[0].ref);
      });

      redirect(DASHBOARD_PATH);
    }
  }
};

export { registerJudgeMentorWithEmail };
