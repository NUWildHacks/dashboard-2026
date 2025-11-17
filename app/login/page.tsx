"use server";

import Image from "next/image";
import { redirect } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { DASHBOARD_PATH } from "@/constants/routes";

import { verifySession } from "../../lib/session";

import LoginButton from "./_components/login-button";

export default async function Login() {
  const userId = await verifySession();
  if (userId) redirect(DASHBOARD_PATH);

  return (
    <div className="max-w-[650px]">
      <Card>
        <CardContent className="flex flex-col items-center gap-6">
          <Image src="/wildhacks-splash.svg" alt="Main Logo" width={300} height={114} loading="eager" />
          <p className="text-sm text-center">
            Before we continue, let&apos;s make sure you&apos;re logged in first
          </p>
          <LoginButton />
        </CardContent>
      </Card>
    </div>
  );
}
