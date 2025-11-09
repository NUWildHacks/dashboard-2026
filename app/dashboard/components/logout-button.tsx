"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { deleteSession } from "@/app/_lib/session";
import { Button } from "@/components/ui/button";
import { ROOT_PATH } from "@/constants/routes";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await deleteSession();

    router.replace(ROOT_PATH);
  };

  return (
    <Button variant="outline" size="lg" onClick={handleLogout}>
      <LogOut />
      Logout
    </Button>
  );
}
