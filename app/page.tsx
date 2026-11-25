import Image from "next/image";

import {
  Completed,
  Footer,
  Navbar,
  Closed,
  Ongoing,
} from "@/app/_components";
import { getConfig } from "@/lib/server";

const RootPage = async () => {
  const { end_time, registration_deadline } =
    await getConfig();

  const now = new Date().getTime();

  return (
    <>
      <Navbar />
      <main className="flex-1 px-6 sm:px-12 flex flex-col justify-center items-center">
        <div className="max-w-[700px] text-center space-y-5">
          <Image
            src="/wildhacks-splash.svg"
            alt="Main Logo"
            width={700}
            height={260}
            loading="eager"
          />
          {now < registration_deadline && <Ongoing />}
          {now >= registration_deadline &&
            now < end_time && <Closed />}
          {now >= end_time && <Completed />}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default RootPage;
