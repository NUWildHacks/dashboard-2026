import { useMemo, useState } from "react";

import { ONE_DAY } from "@/constants";
import { getDateFromMilliseconds } from "@/lib";
import { WildHacksConfig } from "@/types";

import { getDayStartFromMilliseconds } from "../_lib";
import { CalendarDay } from "../types";

export type UseScheduleDisplayReturn = {
  selectedDay: CalendarDay;
  availableDays: CalendarDay[];
  handleSelectDay: (dayLabel: CalendarDay["label"]) => void;
  display: "calendar" | "table";
  setDisplay: (display: "calendar" | "table") => void;
};

export const useScheduleDisplay = (
  start_time: WildHacksConfig["start_time"],
  end_time: WildHacksConfig["end_time"]
): UseScheduleDisplayReturn => {
  const availableDays = useMemo(() => {
    const days: CalendarDay[] = [];
    let currentDayStartMs = getDayStartFromMilliseconds(start_time);

    while (currentDayStartMs < end_time) {
      const dayEndMs = currentDayStartMs + ONE_DAY;
      const dayLabel = getDateFromMilliseconds(currentDayStartMs);
      days.push({ startMs: currentDayStartMs, endMs: dayEndMs, label: dayLabel });
      currentDayStartMs = dayEndMs;
    }

    return days;
  }, [start_time, end_time]);

  const [selectedDay, setSelectedDay] = useState<CalendarDay>(() => {
    const now = new Date().getTime();
    const todayStartMs = getDayStartFromMilliseconds(now);

    const currentDay = availableDays.find((day) => day.startMs === todayStartMs);

    return currentDay ?? availableDays[0]!;
  });
  const [display, setDisplay] = useState<"calendar" | "table">("calendar");

  const handleSelectDay = (dayLabel: CalendarDay["label"]) => {
    const newSelectedDay = availableDays.find((day) => day.label === dayLabel);
    setSelectedDay(newSelectedDay ?? availableDays[0]!);
  };

  return {
    selectedDay,
    availableDays,
    handleSelectDay,
    display,
    setDisplay,
  };
};
