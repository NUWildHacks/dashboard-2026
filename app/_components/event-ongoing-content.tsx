import { CodeXml } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DASHBOARD_PATH } from "@/constants/routes";

export default async function EventOngoingContent() {
  return (
    <>
      <h2 className="text-4xl sm:text-5xl font-semibold">We are underway! 🚀</h2>
      <p>
        Our participants are hard at work building amazing projects. Registration is closed, but you can follow along
        and see what gets created.
      </p>
      <div className="flex justify-center items-center gap-2 flex-wrap">
        <Link href={DASHBOARD_PATH}>
          <Button variant="outline">
            <CodeXml />
            Continue to Dashboard
          </Button>
        </Link>
        <Link href="#">
          <Button variant="link">Follow along on socials</Button>
        </Link>
      </div>
    </>
  );
}
