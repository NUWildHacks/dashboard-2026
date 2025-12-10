"use client";

import { useEffect, useState } from "react";

import { ONE_HOUR, ONE_MINUTE, ONE_SECOND } from "@/constants/time";
import { WildHacksConfig } from "@/types/wildhacks";

export type UseTimeRemainingReturn = {
  hours: number;
  minutes: number;
  seconds: number;
};

const getRemainingTime = (
  started_at: WildHacksConfig["started_at"],
  duration: WildHacksConfig["duration"]
) => {
  if (!started_at) return 0;

  const now = new Date().getTime();
  const elapsed = now - started_at;
  const remaining = Math.max(duration - elapsed, 0);

  return remaining;
};

export const useTimeRemaining = (
  started_at: WildHacksConfig["started_at"],
  duration: WildHacksConfig["duration"]
): UseTimeRemainingReturn => {
  const [timeMilliseconds, setTimeMilliseconds] = useState<number>(() =>
    getRemainingTime(started_at, duration)
  );

  useEffect(() => {
    if (!started_at) return;

    const updateCountdown = () => {
      const remainingTime = getRemainingTime(started_at, duration);
      setTimeMilliseconds(remainingTime);
    };

    const interval = setInterval(() => {
      updateCountdown();
    }, ONE_SECOND);

    return () => clearInterval(interval);
  }, [started_at, duration]);

  let remainingMilliseconds = timeMilliseconds;

  const hours = Math.floor(remainingMilliseconds / ONE_HOUR);
  remainingMilliseconds = remainingMilliseconds % ONE_HOUR;

  const minutes = Math.floor(remainingMilliseconds / ONE_MINUTE);
  remainingMilliseconds = remainingMilliseconds % ONE_MINUTE;

  const seconds = Math.floor(remainingMilliseconds / ONE_SECOND);

  return { hours, minutes, seconds };
};
