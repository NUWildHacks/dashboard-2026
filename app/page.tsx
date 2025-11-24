"use server";

import Image from "next/image";

import "@/config/firebase-admin";
import Footer from "@/app/_components/footer";
import Navbar from "@/app/_components/navbar";
import { COMPLETED, ONGOING, REGISTRATION } from "@/constants/event";
import Event from "@/types/event";

import { getEventDocSnapshot } from "../lib/event";

import Completed from "./_components/completed";
import Ongoing from "./_components/ongoing";

export default async function Home() {
  const eventDocSnapshot = await getEventDocSnapshot();
  const { state } = eventDocSnapshot.data() as Event;

  return (
    <>
      <Navbar />
      <main className="flex-1 px-6 sm:px-12 flex flex-col justify-center items-center">
        <div className="max-w-[650px] text-center space-y-5">
          <Image src="/wildhacks-splash.svg" alt="Main Logo" width={650} height={246.55} loading="eager" />
          {state === ONGOING || (state === REGISTRATION && <Ongoing />)}
          {state === COMPLETED && <Completed />}
        </div>
      </main>
      <Footer />
    </>
  );
}
