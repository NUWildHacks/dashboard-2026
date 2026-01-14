import { CodeXml } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const Completed = async () => {
  return (
    <>
      <h2 className="text-4xl sm:text-5xl font-semibold">That&apos;s a wrap! 🎉</h2>
      <p>
        Thank you to every participant, mentor, sponsor, and volunteer who made this year&apos;s hackathon
        extraordinary. From first-time hackers to returning champions, you all brought your best.
      </p>
      <div className="flex justify-center items-center gap-2 flex-wrap">
        <Link href="#">
          <Button variant="outline">
            <CodeXml />
            Browse Projects
          </Button>
        </Link>
        <Link href="#">
          <Button variant="link">Get notified for WildHacks 2027</Button>
        </Link>
      </div>
    </>
  );
};

export default Completed;
