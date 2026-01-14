import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { DASHBOARD_PATH, ROOT_PATH } from "@/constants";
import { verifySession } from "@/lib";

import LoginButton from "./_components/login-button";

const LoginPage = async () => {
  const userId = await verifySession();
  if (userId) redirect(DASHBOARD_PATH);

  return (
    <main className="flex-1 px-6 sm:px-12 flex flex-col justify-center items-center">
      <div className="max-w-[650px]">
        <Card>
          <CardContent className="flex flex-col items-center gap-6">
            <Link href={ROOT_PATH} aria-label="Return home">
              <Image src="/wildhacks-splash.svg" alt="Main Logo" width={300} height={114} loading="eager" />
            </Link>
            <p className="text-sm text-center">Before we continue, let&apos;s make sure you&apos;re logged in first</p>
            <LoginButton />
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default LoginPage;
