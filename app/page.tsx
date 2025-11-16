"use server";

import Image from "next/image";

import "@/config/firebase-admin";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { COMPLETED, ONGOING, REGISTRATION } from "@/constants/event";
import Event from "@/types/event";

import getEventDocSnapshot from "../lib/event";

import EventCompletedContent from "./_components/event-completed-content";
import EventOngoingContent from "./_components/event-ongoing-content";
import EventRegistrationContent from "./_components/event-registration-content";

export default async function Home() {
  const eventDocSnapshot = await getEventDocSnapshot();
  const { state } = eventDocSnapshot.data() as Event;

  return (
    <>
      <Navbar />
      <main className="flex-1 px-6 sm:px-12 py-4 flex flex-col justify-center items-center gap-12">
        <div className="max-w-[650px] text-center space-y-5">
          <Image src="/wildhacks-splash.svg" alt="Main Logo" width={650} height={246.55} loading="eager" />
          {state === REGISTRATION && <EventRegistrationContent />}
          {state === ONGOING && <EventOngoingContent />}
          {state === COMPLETED && <EventCompletedContent />}
        </div>
      </main>
      <Footer />
    </>
  );
}
