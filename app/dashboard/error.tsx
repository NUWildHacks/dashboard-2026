"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ROOT_PATH } from "@/constants/routes.constants";
import { ErrorPageProps } from "@/types/error-page.types";

const DashboardError = ({ error, reset }: ErrorPageProps) => {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <main className="flex-1 px-6 sm:px-12 flex flex-col justify-center items-center">
      <Card className="w-full max-w-[400px]">
        <CardHeader>
          <CardTitle>Oops! 🫣</CardTitle>
          <CardDescription>
            Something went wrong while processing your request. We&apos;re sorry about that!
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-row-reverse">
          <Button onClick={reset} variant="outline">
            Try again
          </Button>
          <Link href={ROOT_PATH}>
            <Button variant="link">Return home</Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
};

export default DashboardError;
