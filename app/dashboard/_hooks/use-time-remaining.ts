"use client";

import { useEffect, useState } from "react";

import { ONE_HOUR, ONE_MINUTE, ONE_SECOND } from "@/constants/time";
import { EventConfig } from "@/types/event";

export type UseTimeRemainingReturn = {
  hours: number;
  minutes: number;
  seconds: number;
};

const getRemainingTime = (
  event_started_at: EventConfig["event_started_at"],
  event_duration: EventConfig["event_duration"]
) => {
  if (!event_started_at) return 0;

  const now = new Date().getTime();
  const elapsed = now - event_started_at;
  const remaining = Math.max(event_duration - elapsed, 0);

  return remaining;
};

export const useTimeRemaining = (
  event_started_at: EventConfig["event_started_at"],
  event_duration: EventConfig["event_duration"]
): UseTimeRemainingReturn => {
  const [timeMilliseconds, setTimeMilliseconds] = useState<number>(() =>
    getRemainingTime(event_started_at, event_duration)
  );

  useEffect(() => {
    if (!event_started_at) return;

    const updateCountdown = () => {
      const remainingTime = getRemainingTime(event_started_at, event_duration);
      setTimeMilliseconds(remainingTime);
    };

    const interval = setInterval(() => {
      updateCountdown();
    }, ONE_SECOND);

    return () => clearInterval(interval);
  }, [event_started_at, event_duration]);

  let remainingMilliseconds = timeMilliseconds;

  const hours = Math.floor(remainingMilliseconds / ONE_HOUR);
  remainingMilliseconds = remainingMilliseconds % ONE_HOUR;

  const minutes = Math.floor(remainingMilliseconds / ONE_MINUTE);
  remainingMilliseconds = remainingMilliseconds % ONE_MINUTE;

  const seconds = Math.floor(remainingMilliseconds / ONE_SECOND);

  return { hours, minutes, seconds };
};
