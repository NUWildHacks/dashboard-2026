"use server";

import { ArrowLeftFromLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DASHBOARD_PATH, ROOT_PATH } from "@/constants/routes";

import { verifySession } from "../../lib/session";

import LoginButton from "./_components/login-button";

export default async function Login() {
  const userId = await verifySession();
  if (userId) redirect(DASHBOARD_PATH);

  return (
    <>
      <Navbar>
        <Link href={ROOT_PATH}>
          <Button variant="link">
            <ArrowLeftFromLine />
            Go Back
          </Button>
        </Link>
      </Navbar>
      <main className="flex-1 px-6 sm:px-12 py-4 flex flex-col justify-center items-center gap-12">
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
      </main>
      <Footer />
    </>
  );
}
