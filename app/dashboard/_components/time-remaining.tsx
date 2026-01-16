"use client";

import { useTimeRemaining } from "@/app/dashboard/_hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { WildHacksConfig } from "@/types";

type TimeRemainingProps = Pick<WildHacksConfig, "start_time" | "end_time">;

const TimeRemaining = ({ start_time, end_time }: TimeRemainingProps) => {
  const { hours, minutes, seconds } = useTimeRemaining(start_time, end_time);
  const now = new Date().getTime();
  const hasStarted = now >= start_time;
  const hasEnded = now >= end_time;

  return (
    <Card className="shadow-xs md:col-span-2">
      <CardHeader>
        <CardTitle>Time Remaining</CardTitle>
        <CardDescription>
          {hasStarted && !hasEnded
            ? "The clock is ticking! See how much time you have left to build your project."
            : hasEnded
              ? "The event has ended. Thank you for participating!"
              : "Waiting for the event to start. In the meantime, get together with your team and start brainstorming!"}
        </CardDescription>
      </CardHeader>
      {hasStarted && !hasEnded && (
        <CardContent className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="flex flex-col justify-center items-center bg-secondary py-2 rounded-lg">
            <strong className="text-3xl text-primary">{String(hours).padStart(2, "0")}</strong>
            <p className="text-sm text-muted-foreground">Hours</p>
          </div>
          <div className="flex flex-col justify-center items-center bg-secondary py-2 rounded-lg">
            <strong className="text-3xl text-primary">{String(minutes).padStart(2, "0")}</strong>
            <p className="text-sm text-muted-foreground">Minutes</p>
          </div>
          <div className="flex flex-col justify-center items-center bg-secondary py-2 rounded-lg">
            <strong className="text-3xl text-primary">{String(seconds).padStart(2, "0")}</strong>
            <p className="text-sm text-muted-foreground">Seconds</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default TimeRemaining;
