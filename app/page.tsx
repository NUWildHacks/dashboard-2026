import { LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Navbar from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 px-6 sm:px-12 py-4 flex flex-col justify-center items-center gap-12">
        <div className="max-w-[650px]">
          <Image src="/wildhacks-splash.svg" alt="Main Logo" width={650} height={246.55} className="w-full" />
          <div className="text-center space-y-5">
            <h2 className="text-4xl sm:text-5xl font-semibold">
              Northwestern&apos;s premier hackathon is coming back! ⏳
            </h2>
            <p>
              Whether you&apos;re a first-time coder or a seasoned developer, WildHacks is your chance to build
              something amazing in 24 hours. Join hundreds of students for a weekend of innovation, collaboration, and
              creativity!
            </p>
            <div className="flex justify-center items-center gap-2 flex-wrap">
              <Link href="/registration">
                <Button variant="outline">
                  <LogIn />
                  Register Now
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="link">Continue to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
