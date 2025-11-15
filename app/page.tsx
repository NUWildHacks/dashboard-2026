"use server";

import Image from "next/image";

import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { getFirestore } from "firebase-admin/firestore";
import { EVENT_DOC, METADATA_COLLECTION } from "@/constants/db";
import Event from "@/types/event";
import { COMPLETED, ONGOING, REGISTRATION } from "@/constants/event";
import EventRegistrationContent from "./components/event-registration-content";
import EventOngoingContent from "./components/event-ongoing-content";
import EventCompletedContent from "./components/event-completed-content";

export default async function Home() {
  const db = getFirestore();
  const eventDocRef = db.collection(METADATA_COLLECTION).doc(EVENT_DOC);
  const eventDocSnapshot = await eventDocRef.get();
  const event = eventDocSnapshot.data() as Event

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
