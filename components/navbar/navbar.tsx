import { CodeXml, User } from "lucide-react";
import Link from "next/link";

import { verifySession } from "@/app/_lib/session";

import { Button } from "../ui/button";

import LoginButton from "./login-button";
import LogoutButton from "./logout-button";

export default async function Navbar() {
  const user = await verifySession();

  return (
    <nav className="w-full sm:px-12 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
      <Link href="/" className="flex justify-center items-center gap-2">
        <CodeXml className="size-8" />
        <h1 className="text-2xl sm:block hidden">WildHacks Dashboard</h1>
      </Link>
      <div className="flex justify-center items-center gap-4">
        {user ? (
          <>
            <Button variant="ghost">
              <User />
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <LogoutButton />
          </>
        ) : (
          <LoginButton />
        )}
      </div>
    </nav>
  );
}
