"use server";

import { ArrowLeftFromLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import LoginButton from "@/components/navbar/login-button";
import Navbar from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function Login() {
  return (
    <>
      <Navbar>
        <Link href="/">
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
              <Image src="/wildhacks-splash.svg" alt="Main Logo" width={300} height={114} className="w-full" />
              <p className="text-sm">Before we continue, let&apos;s make sure you&apos;re logged in first</p>
              <LoginButton />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
