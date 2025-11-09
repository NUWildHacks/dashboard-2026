"use server";

import { getFirestore } from "firebase-admin/firestore";
import { redirect } from "next/navigation";

import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";

import { verifySession } from "../_lib/session";

import LogoutButton from "./components/logout-button";

export default async function Dashboard() {
  const userId = await verifySession();
  if (!userId) {
    redirect(`/login?redirect=${encodeURIComponent("/registration")}`);
  }

  const db = getFirestore();
  const userDocRef = db.collection("users").doc(userId);
  const userDocSnapshot = await userDocRef.get();

  if (!userDocSnapshot.exists) {
    redirect("/registration");
  }

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
