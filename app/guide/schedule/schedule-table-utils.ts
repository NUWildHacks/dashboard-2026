export const formatDateWithWeekday = (dateLabel: string) => {
  const parsed = new Date(`${dateLabel} 12:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return dateLabel;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
};

export const getScheduleRowClass = (highlight?: "deadline") =>
  highlight === "deadline" ? "guide-schedule-row-deadline" : undefined;
