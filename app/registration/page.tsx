"use server";

import { ArrowLeftFromLine } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import "@/config/firebase-admin";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { DASHBOARD_PATH, LOGIN_PATH, REGISTRATION_PATH, ROOT_PATH } from "@/constants/routes";
import Event from "@/types/event";

import getEventDocSnapshot from "../../lib/event";
import { verifySession } from "../../lib/session";
import getUserDocSnapshot from "../../lib/user";

import RegistrationForm from "./_components/registration-form";

export default async function Registration() {
  const eventDocSnapshot = await getEventDocSnapshot();
  const { state } = eventDocSnapshot.data() as Event;

  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(REGISTRATION_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (userDocSnapshot.exists) redirect(DASHBOARD_PATH);

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
            <RegistrationForm userId={userId} eventState={state} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
