"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WildHacksConfig } from "@/types/wildhacks";

import { useTimeRemaining } from "../_hooks/use-time-remaining";

type TimeRemainingProps = Pick<WildHacksConfig, "started_at" | "duration">;

const TimeRemaining = ({ started_at, duration }: TimeRemainingProps) => {
  const { hours, minutes, seconds } = useTimeRemaining(started_at, duration);

  return (
    <Card className="shadow-none md:col-span-2">
      <CardHeader>
        <CardTitle>Time Remaining</CardTitle>
        <CardDescription>
          {started_at
            ? "The clock is ticking! See how much time you have left to build your project."
            : "Waiting for event organizers to start the clock. In the meantime, get together with your team and start brainstorming!"}
        </CardDescription>
      </CardHeader>
      {started_at && (
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
