"use client";

import { useEffect, useState } from "react";

import { ONE_DAY, ONE_HOUR, ONE_MINUTE, ONE_SECOND } from "@/constants/time";
import { EventConfig } from "@/types/event";

export type UseTimeRemainingReturn = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export const useTimeRemaining = (
  event_started_at: EventConfig["event_started_at"],
  event_duration: EventConfig["event_duration"]
): UseTimeRemainingReturn => {
  const [timeMilliseconds, setTimeMilliseconds] = useState<number>(0);

  useEffect(() => {
    if (!event_started_at) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const elapsed = now - event_started_at;
      const remaining = event_duration - elapsed;

      setTimeMilliseconds(remaining);
    };

    const interval = setInterval(() => {
      updateCountdown();
    }, ONE_SECOND);

    return () => clearInterval(interval);
  }, [event_started_at, event_duration]);

  let remainingMilliseconds = timeMilliseconds;

  const days = Math.floor(remainingMilliseconds / ONE_DAY);
  remainingMilliseconds = remainingMilliseconds % ONE_DAY;

  const hours = Math.floor(remainingMilliseconds / ONE_HOUR);
  remainingMilliseconds = remainingMilliseconds % ONE_HOUR;

  const minutes = Math.floor(remainingMilliseconds / ONE_MINUTE);
  remainingMilliseconds = remainingMilliseconds % ONE_MINUTE;

  const seconds = Math.floor(remainingMilliseconds / ONE_SECOND);

  return { days, hours, minutes, seconds };
};
