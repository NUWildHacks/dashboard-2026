"use server";

import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { USERS_COLLECTION } from "@/constants/db";
import { LOGIN_PATH, REGISTRATION_PATH } from "@/constants/routes";
import { verifySession } from "@/lib/session";

import LogoutButton from "./components/logout-button";

export default async function Dashboard() {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(REGISTRATION_PATH)}`);

  const db = getFirestore();
  const userDocRef = db.collection(USERS_COLLECTION).doc(userId);
  const userDocSnapshot = await userDocRef.get();

  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  return (
    <>
      <Navbar>
        <LogoutButton />
      </Navbar>
      <main className="flex-1 px-6 sm:px-12 py-4 flex flex-col justify-center items-center gap-12">
        <div className="max-w-[650px]">Dashboard Page</div>
      </main>
      <Footer />
    </>
  );
}
