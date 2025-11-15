"use client";

import { LogOut } from "lucide-react";

import { deleteSession } from "@/app/_lib/session";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  return (
    <Button variant="outline" size="lg" onClick={deleteSession}>
      <LogOut />
      Logout
    </Button>
  );
}
