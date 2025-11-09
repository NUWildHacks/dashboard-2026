"use server";

import { getFirestore } from "firebase-admin/firestore";
import { ArrowLeftFromLine } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import Navbar from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";

import { verifySession } from "../_lib/session";

import RegistrationForm from "./components/registration-form";

export default async function Registration() {
  //TODO: handle async failures
  const userId = await verifySession();
  if (!userId) {
    redirect(`/login?redirect=${encodeURIComponent("/registration")}`);
  }

  const db = getFirestore();
  const userDocRef = db.collection("users").doc(userId);
  const userDocSnapshot = await userDocRef.get();

  if (userDocSnapshot.exists) {
    redirect("/dashboard");
  }

  return (
    <>
      <Navbar>
        <Link href="/">
          <Button variant="link">
            <ArrowLeftFromLine />
            Go Back
          </Button>
        </Link>
      </Navbar>
      <main className="flex-1 px-6 sm:px-12 py-4 flex flex-col justify-center items-center gap-12">
        <div className="max-w-[650px]">
          <div className="text-center space-y-5">
            <h2 className="text-4xl sm:text-5xl font-semibold">Hey there, future hacker! 👋</h2>
            <p>
              Fill out the registration form below and you&apos;ll be all set. We just need some basic info to get you
              started. This should only take a few minutes!
            </p>
            <RegistrationForm userId={userId} />
          </div>
        </div>
      </main>
    </>
  );
}
