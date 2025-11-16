"use server";

import Image from "next/image";

import "@/config/firebase-admin";
import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { COMPLETED, ONGOING, REGISTRATION } from "@/constants/event";
import Event from "@/types/event";

import getEventDocSnapshot from "./_data/event";
import EventCompletedContent from "./components/event-completed-content";
import EventOngoingContent from "./components/event-ongoing-content";
import EventRegistrationContent from "./components/event-registration-content";

export default async function Home() {
  const eventDocSnapshot = await getEventDocSnapshot();
  const event = eventDocSnapshot.data() as Event;

  return (
    <>
      <Navbar />
      <main className="flex-1 px-6 sm:px-12 py-4 flex flex-col justify-center items-center gap-12">
        <div className="max-w-[650px] text-center space-y-5">
          <Image src="/wildhacks-splash.svg" alt="Main Logo" width={650} height={246.55} loading="eager" />
          {event.state === REGISTRATION && <EventRegistrationContent />}
          {event.state === ONGOING && <EventOngoingContent />}
          {event.state === COMPLETED && <EventCompletedContent />}
        </div>
      </main>
      <Footer />
    </>
  );
}
