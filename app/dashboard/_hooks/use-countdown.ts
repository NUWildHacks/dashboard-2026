"use client";

import { useEffect, useState } from "react";

import { ONE_DAY, ONE_HOUR, ONE_MINUTE, ONE_SECOND } from "@/constants";
import type { WildHacksConfig } from "@/types";

export type UseCountdownReturn = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  hasStarted: boolean;
  hasEnded: boolean;
};

export const useCountdown = (
  start_time: WildHacksConfig["start_time"],
  end_time: WildHacksConfig["end_time"]
): UseCountdownReturn => {
  const [timeMilliseconds, setTimeMilliseconds] = useState<number>(0);

  useEffect(() => {
    const getRemainingTime = () => {
      const now = new Date().getTime();

      if (now <= start_time) {
        return Math.max(start_time - now, 0);
      }

      return Math.max(end_time - now, 0);
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
  }, [start_time, end_time]);

  let remainingMilliseconds = timeMilliseconds;

  const days = Math.floor(remainingMilliseconds / ONE_DAY);
  remainingMilliseconds = remainingMilliseconds % ONE_DAY;

  const hours = Math.floor(remainingMilliseconds / ONE_HOUR);
  remainingMilliseconds = remainingMilliseconds % ONE_HOUR;

  const minutes = Math.floor(remainingMilliseconds / ONE_MINUTE);
  remainingMilliseconds = remainingMilliseconds % ONE_MINUTE;

  const seconds = Math.floor(remainingMilliseconds / ONE_SECOND);

  const now = new Date().getTime();
  const hasStarted = now >= start_time;
  const hasEnded = now >= end_time;

  return { days, hours, minutes, seconds, hasStarted, hasEnded };
};
