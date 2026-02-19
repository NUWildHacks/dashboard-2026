import { LogIn } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { REGISTRATION_PATH, JUDGE_REGISTRATION_PATH } from "@/constants";

const Registration = async () => {
  return (
    <>
      <h2 className="text-4xl sm:text-5xl font-semibold">Welcome to WildHacks 2026! 🚀</h2>
      <p>
        Whether you&apos;re a first-time coder or a seasoned developer, this is your chance to build something amazing
        in 24 hours. Join hundreds of students for a weekend of innovation, collaboration, and creativity!
      </p>
      <div className="flex justify-center items-center gap-2 flex-wrap">
        <Link href={REGISTRATION_PATH}>
          <Button variant="outline">
            <LogIn />
            Register as a participant
          </Button>
        </Link>
        <a target="_blank" rel="noreferrer" href={JUDGE_REGISTRATION_PATH}>
          <Button variant="link">Register as a judge or mentor</Button>
        </a>
      </div>
    </>
  );
};

export default Registration;
