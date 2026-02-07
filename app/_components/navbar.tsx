"use server";

import { LayoutDashboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DASHBOARD_PATH } from "@/constants/routes.constants";

const Navbar = async () => {
  return (
    <nav className="w-full h-[72px] px-6 sm:px-12 flex justify-between items-center">
      <div className="flex justify-between w-full items-center gap-2">
        <Image src="/wildhacks.svg" alt="Navigation Logo" width={39} height={50.74} />
        <Link href={DASHBOARD_PATH}>
          <Button>
            <LayoutDashboard />
            Continue to Dashboard
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
