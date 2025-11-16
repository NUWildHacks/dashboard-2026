"use server";

import Image from "next/image";

import "@/config/firebase-admin";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { COMPLETED, ONGOING, REGISTRATION } from "@/constants/event";
import Event from "@/types/event";

import getEventDocSnapshot from "../lib/event";

import Completed from "./_components/completed";
import Ongoing from "./_components/ongoing";
import Registration from "./_components/registration";

export default async function Home() {
  const eventDocSnapshot = await getEventDocSnapshot();
  const { state } = eventDocSnapshot.data() as Event;

  return (
    <>
      <Navbar />
      <main className="flex-1 px-6 sm:px-12 py-4 flex flex-col justify-center items-center gap-12">
        <div className="max-w-[650px] text-center space-y-5">
          <Image src="/wildhacks-splash.svg" alt="Main Logo" width={650} height={246.55} loading="eager" />
          {state === REGISTRATION && <Registration />}
          {state === ONGOING && <Ongoing />}
          {state === COMPLETED && <Completed />}
        </div>
      </main>
      <Footer />
    </>
  );
}
