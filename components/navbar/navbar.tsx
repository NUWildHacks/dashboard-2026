import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren } from "react";

type NavbarProps = PropsWithChildren;

export default async function Navbar({ children }: NavbarProps) {
  return (
    <nav className="w-full px-6 sm:px-12 py-4 flex justify-between items-center">
      <Link href="/" className="flex justify-center items-center gap-2">
        <Image src="/wildhacks.svg" alt="Navigation Logo" width={62} height={40} />
        <h1 className="text-2xl sm:block hidden text-nowrap sr-only">WildHacks Dashboard</h1>
      </Link>
      {children}
    </nav>
  );
}
