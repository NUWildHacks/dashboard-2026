import { useMemo, useState } from "react";

import { ONE_DAY } from "@/constants";
import { getDateFromMilliseconds } from "@/lib";
import { WildHacksConfig } from "@/types";

import { getDayStartFromMilliseconds, getVisibleCalendarRows } from "../lib";
import { CalendarDay, CalendarRowConfig } from "../types";

export type UseCalendarReturn = {
  selectedDay: CalendarDay;
  availableDays: CalendarDay[];
  visibleCalendarRows: CalendarRowConfig[];
  handleSelectDay: (dayLabel: CalendarDay["label"]) => void;
};

export const useCalendar = (
  start_time: WildHacksConfig["start_time"],
  end_time: WildHacksConfig["end_time"]
): UseCalendarReturn => {
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

  const handleSelectDay = (dayLabel: CalendarDay["label"]) => {
    const newSelectedDay = availableDays.find((day) => day.label === dayLabel);
    setSelectedDay(newSelectedDay ?? availableDays[0]!);
  };

  const visibleCalendarRows = getVisibleCalendarRows(start_time, end_time, selectedDay.startMs, selectedDay.endMs);

  return {
    selectedDay,
    availableDays,
    visibleCalendarRows,
    handleSelectDay,
  };
};
