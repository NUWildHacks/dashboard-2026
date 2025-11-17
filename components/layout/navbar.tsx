import Image from "next/image";
import Link from "next/link";

import { ROOT_PATH } from "@/constants/routes";

export default function Navbar() {
  return (
    <nav className="w-full h-[72px] px-6 sm:px-12 flex justify-between items-center">
      <Link href={ROOT_PATH} className="flex justify-center items-center gap-2">
        <Image src="/wildhacks.svg" alt="Navigation Logo" width={62} height={40} />
        <h1 className="text-2xl sm:block hidden text-nowrap sr-only">WildHacks Dashboard</h1>
      </Link>
    </nav>
  );
}
