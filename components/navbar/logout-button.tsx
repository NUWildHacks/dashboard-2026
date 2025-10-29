"use client";

import { LogOut } from "lucide-react";

import { deleteSession } from "@/app/_lib/session";

import { Button } from "../ui/button";

export default function LogoutButton() {
  const handleLogout = async () => {
    await deleteSession();
  };

  return (
    <Button variant="outline" size="lg" onClick={handleLogout}>
      <LogOut />
      Logout
    </Button>
  );
}
