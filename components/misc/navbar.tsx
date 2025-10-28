"use client";

import { CodeXml, Github, LogOut } from "lucide-react";

import { useAuth } from "@/contexts/auth/use-auth";

import { Button } from "../ui/button";

export default function Navbar() {
  const { user, handleLogin, handleLogout } = useAuth();

  return (
    <nav className="w-full sm:px-12 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
      <div className="flex justify-center items-center gap-2">
        <CodeXml className="size-8" />
        <h1 className="text-2xl sm:block hidden">WildHacks Dashboard</h1>
      </div>
      <div className="flex justify-center items-center gap-2">
        {user ? (
          <Button variant="outline" size="lg" onClick={handleLogout}>
            <LogOut />
            Logout
          </Button>
        ) : (
          <Button variant="outline" size="lg" onClick={handleLogin}>
            <Github />
            Login with Github
          </Button>
        )}
      </div>
    </nav>
  );
}
