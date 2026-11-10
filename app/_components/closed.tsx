import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DASHBOARD_PATH } from "@/constants/routes.constants";

const Closed = () => {
  return (
    <>
      <h2 className="text-4xl sm:text-5xl font-semibold">
        Welcome to WildHacks! 🚀
      </h2>
      <p>
        Registration is open! Join us and 100+ other hackers
        this January for an amazing weekend.
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
