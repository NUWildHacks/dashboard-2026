"use client";

import { useCountdown } from "@/app/dashboard/_hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib";
import type { WildHacksConfig } from "@/types";

type CountdownProps = Pick<WildHacksConfig, "start_time" | "end_time">;

const Countdown = ({ start_time, end_time }: CountdownProps) => {
  const { days, hours, minutes, seconds, hasStarted, hasEnded } = useCountdown(start_time, end_time);

  let descriptionText = "";
  if (hasStarted && !hasEnded) {
    descriptionText = "The clock is ticking! See how much time you have left to build your project.";
  } else if (hasEnded) {
    descriptionText = "The event has ended. Thank you for participating!";
  } else {
    descriptionText =
      "Waiting for the event to start. In the meantime, get together with your team and start brainstorming!";
  }

  return (
    <Card className="shadow-xs h-full">
      <CardHeader>
        <CardTitle>Time Remaining</CardTitle>
        <CardDescription>{descriptionText}</CardDescription>
      </CardHeader>
      {!hasEnded && (
        <CardContent className={cn("grid gap-2 sm:gap-4", days > 0 ? "grid-cols-4" : "grid-cols-3")}>
          {days > 0 && (
            <div className="flex flex-col justify-center items-center bg-secondary py-2 rounded-lg">
              <strong className="text-3xl text-primary">{String(days).padStart(2, "0")}</strong>
              <p className="text-sm text-muted-foreground">Days</p>
            </div>
          )}
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

export default Countdown;
