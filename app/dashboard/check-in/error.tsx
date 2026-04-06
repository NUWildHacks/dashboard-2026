"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DASHBOARD_PATH } from "@/constants";
import type { ErrorPageProps } from "@/types";

const CheckInError = ({ error, reset }: ErrorPageProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex-1 px-6 sm:px-12 flex flex-col justify-center items-center">
      <Card className="w-full max-w-[420px]">
        <CardHeader>
          <CardTitle>Check-in unavailable</CardTitle>
          <CardDescription>
            Something went wrong while loading the admin check-in console. Please try again.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-row-reverse">
          <Button onClick={reset} variant="outline">
            Try again
          </Button>
          <Link href={DASHBOARD_PATH}>
            <Button variant="link">Go to dashboard</Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
};

export default CheckInError;
