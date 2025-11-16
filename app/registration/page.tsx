"use server";

import { getFirestore } from "firebase-admin/firestore";
import { ArrowLeftFromLine } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import "@/config/firebase-admin";
import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { EVENT_DOC, METADATA_COLLECTION, USERS_COLLECTION } from "@/constants/db";
import { DASHBOARD_PATH, LOGIN_PATH, REGISTRATION_PATH, ROOT_PATH } from "@/constants/routes";
import { verifySession } from "@/lib/session";
import Event from "@/types/event";

import RegistrationForm from "./components/registration-form";

export default async function Registration() {
  //TODO: handle async failures
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(REGISTRATION_PATH)}`);

  const db = getFirestore();

  const userDocRef = db.collection(USERS_COLLECTION).doc(userId);
  const eventDocRef = db.collection(METADATA_COLLECTION).doc(EVENT_DOC);

  const [userDocSnapshot, eventDocSnapshot] = await Promise.all([userDocRef.get(), eventDocRef.get()]);

  if (userDocSnapshot.exists) redirect(DASHBOARD_PATH);

  const event = eventDocSnapshot.data() as Event;

  return (
    <>
      <Navbar>
        <Link href={ROOT_PATH}>
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
            <RegistrationForm userId={userId} eventState={event.state} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
