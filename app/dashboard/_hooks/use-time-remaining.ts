"use client";

import { useEffect, useState } from "react";

import { ONE_HOUR, ONE_MINUTE, ONE_SECOND } from "@/constants";
import type { WildHacksConfig } from "@/types";

export type UseTimeRemainingReturn = {
  hours: number;
  minutes: number;
  seconds: number;
};

export const useTimeRemaining = (
  start_time: WildHacksConfig["start_time"],
  end_time: WildHacksConfig["end_time"]
): UseTimeRemainingReturn => {
  const [timeMilliseconds, setTimeMilliseconds] = useState<number>(0);

  useEffect(() => {
    const getRemainingTime = () => {
      const now = new Date().getTime();
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

  const hours = Math.floor(remainingMilliseconds / ONE_HOUR);
  remainingMilliseconds = remainingMilliseconds % ONE_HOUR;

  const minutes = Math.floor(remainingMilliseconds / ONE_MINUTE);
  remainingMilliseconds = remainingMilliseconds % ONE_MINUTE;

  const seconds = Math.floor(remainingMilliseconds / ONE_SECOND);

  return { hours, minutes, seconds };
};
