import { LogIn } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DASHBOARD_PATH, REGISTRATION_PATH } from "@/constants/routes";

const Registration = async () => {
  return (
    <>
      <h2 className="text-4xl sm:text-5xl font-semibold">Welcome to Northwestern&apos;s premier hackathon! 🚀</h2>
      <p>
        Whether you&apos;re a first-time coder or a seasoned developer, WildHacks is your chance to build something
        amazing in 24 hours. Join hundreds of students for a weekend of innovation, collaboration, and creativity!
      </p>
      <div className="flex justify-center items-center gap-2 flex-wrap">
        <Link href={REGISTRATION_PATH}>
          <Button variant="outline">
            <LogIn />
            Register for WildHacks 2026
          </Button>
        </Link>
        <Link href={DASHBOARD_PATH}>
          <Button variant="link">Continue to Dashboard</Button>
        </Link>
      </div>
    </>
  );
};

export default Registration;
