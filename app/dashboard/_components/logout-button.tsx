"use client";

import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteSession } from "@/lib/session";

export default function LogoutButton() {
  return (
    <Button variant="outline" size="lg" onClick={deleteSession}>
      <LogOut />
      Logout
    </Button>
  );
}
