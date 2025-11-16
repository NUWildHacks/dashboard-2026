"use server";

import { redirect } from "next/navigation";

import "@/config/firebase-admin";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { LOGIN_PATH, REGISTRATION_PATH } from "@/constants/routes";

import { verifySession } from "../../lib/session";
import getUserDocSnapshot from "../../lib/user";

import LogoutButton from "./_components/logout-button";

export default async function Dashboard() {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(REGISTRATION_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
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
