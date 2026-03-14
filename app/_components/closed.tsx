import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DASHBOARD_PATH } from "@/constants/routes.constants";

const Closed = () => {
  return (
    <>
      <h2 className="text-4xl sm:text-5xl font-semibold">Welcome to WildHacks 2026! 🚀</h2>
      <p>
        Registration for participants, judges, and mentors are now closed, but the excitement is just getting started. For
        those joining us for the weekend, get ready to build something amazing in 24 hours alongside hundreds of
        students in a weekend of innovation, collaboration, and creativity!
      </p>
      <div className="flex justify-center items-center gap-2 flex-wrap">
        <Button asChild>
          <Link href={DASHBOARD_PATH}>
            <LayoutDashboard />
            Continue to Dashboard
          </Link>
        </Button>
      </div>
    </>
  );
};

export default Closed;
