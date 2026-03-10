"use server";

import Image from "next/image";

import "@/config/firebase-admin";
import { Footer, Navbar } from "@/app/_components";
import { getConfigDocSnapshot } from "@/lib";
import type { WildHacksConfig } from "@/types";

import Closed from "./_components/closed";
import Completed from "./_components/completed";

const RootPage = async () => {
  const configDocSnapshot = await getConfigDocSnapshot();
  const { end_time } = configDocSnapshot.data() as WildHacksConfig;

  const now = new Date().getTime();

  return (
    <>
      <Navbar />
      <main className="flex-1 px-6 sm:px-12 flex flex-col justify-center items-center">
        <div className="max-w-[700px] text-center space-y-5">
          <Image src="/wildhacks-splash.svg" alt="Main Logo" width={700} height={260} loading="eager" />
          {/* patch: close registration completely */}
          {now < end_time && <Closed />}
          {now >= end_time && <Completed />}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default RootPage;
