import { CodeXml } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const Completed = () => {
  return (
    <>
      <h2 className="text-4xl sm:text-5xl font-semibold">That&apos;s a wrap! 🎉</h2>
      <p>
        Thank you to every participant, mentor, sponsor, and volunteer who made this year&apos;s WildHacks
        extraordinary. From first-time hackers to returning champions, you all brought your best.
      </p>
      <div className="flex justify-center items-center gap-2 flex-wrap">
        <Button variant="outline" asChild>
          <Link href="https://wildhacks-2026.devpost.com/project-gallery">
            <CodeXml />
            Browse Projects
          </Link>
        </Button>
        <Button asChild>
          {/* <Link href="#">Get notified for WildHacks 2027</Link> */}
          <Link href="#">Coming soon...</Link>
        </Button>
      </div>
    </>
  );
};

export default Completed;
