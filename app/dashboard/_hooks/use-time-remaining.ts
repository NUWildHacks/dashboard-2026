"use client";

import { useEffect, useState } from "react";

import { ONE_HOUR, ONE_MINUTE, ONE_SECOND } from "@/constants/time";
import { WildHacksConfig } from "@/types/wildhacks";

export type UseTimeRemainingReturn = {
  hours: number;
  minutes: number;
  seconds: number;
};



export const useTimeRemaining = (
  started_at: WildHacksConfig["started_at"],
  duration: WildHacksConfig["duration"]
): UseTimeRemainingReturn => {
  const [timeMilliseconds, setTimeMilliseconds] = useState<number>(0);

  useEffect(() => {
    if (!started_at) {
      return;
    }

    const getRemainingTime = () => {
      if (!started_at) return 0;
      const now = new Date().getTime();
      return Math.max(duration - (now - started_at), 0);
    };

    const updateCountdown = () => {
      const remainingTime = getRemainingTime();
      setTimeMilliseconds(remainingTime);
    };

    const timeoutId = setTimeout(() => {
      updateCountdown();
    }, 0);

    const interval = setInterval(() => {
      updateCountdown();
    }, ONE_SECOND);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, [started_at, duration]);

  let remainingMilliseconds = timeMilliseconds;

  const hours = Math.floor(remainingMilliseconds / ONE_HOUR);
  remainingMilliseconds = remainingMilliseconds % ONE_HOUR;

  const minutes = Math.floor(remainingMilliseconds / ONE_MINUTE);
  remainingMilliseconds = remainingMilliseconds % ONE_MINUTE;

  const seconds = Math.floor(remainingMilliseconds / ONE_SECOND);

  return { hours, minutes, seconds };
};
