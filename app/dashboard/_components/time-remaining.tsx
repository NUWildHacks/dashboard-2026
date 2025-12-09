"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EventConfig } from "@/types/event";

import { useTimeRemaining } from "../_hooks/use-time-remaining";

type TimeRemainingProps = Pick<EventConfig, "event_started_at" | "event_duration">;

export default function TimeRemaining({ event_started_at, event_duration }: TimeRemainingProps) {
  const { hours, minutes, seconds } = useTimeRemaining(event_started_at, event_duration);

  return (
    <Card className="shadow-none md:col-span-2">
      <CardHeader>
        <CardTitle>Time Remaining</CardTitle>
        <CardDescription>
          {event_started_at
            ? "The clock is ticking! See how much time you have left to build your project."
            : "Waiting for event organizers to start the clock. In the meantime, get together with your team and start brainstorming!"}
        </CardDescription>
      </CardHeader>
      {event_started_at && (
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
}
