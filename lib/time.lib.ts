import { MONTH_ABBREVIATIONS, ONE_DAY, ONE_HOUR, ONE_MINUTE } from "@/constants/time.constants";

export function getDateFromMilliseconds(milliseconds: number) {
  const date = new Date(milliseconds);

  return `${MONTH_ABBREVIATIONS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export const getTimeFromMinutes = (time: number) => {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  return `${hours > 12 ? hours - 12 : hours}:${minutes.toString().padStart(2, "0")}${hours >= 12 ? " PM" : " AM"}`;
};

export const getTimeFromMilliseconds = (milliseconds: number) => {
  const date = new Date(milliseconds);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours > 12 ? hours - 12 : hours || 12}:${minutes.toString().padStart(2, "0")}${hours >= 12 ? " PM" : " AM"}`;
};

/**
 * Format an event time range with date
 * Returns format: "April 11, 8:00 AM - 5:00 PM"
 * Events are assumed to fit within one day
 */
export const getEventTimeRange = (start_time: number, end_time: number) => {
  const startDate = new Date(start_time);
  const month = MONTH_ABBREVIATIONS[startDate.getMonth()];
  const day = startDate.getDate();
  const startTime = getTimeFromMilliseconds(start_time);
  const endTime = getTimeFromMilliseconds(end_time);

  return `${month} ${day}, ${startTime} - ${endTime}`;
};

export function getSendTime(sendMilliseconds: number) {
  const now = new Date();

  const diffMilliseconds = now.getTime() - sendMilliseconds;

  if (diffMilliseconds < ONE_MINUTE) {
    return "Less than a minute ago";
  } else if (diffMilliseconds < ONE_HOUR) {
    const minutes = Math.floor(diffMilliseconds / ONE_MINUTE);
    return minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`;
  } else if (diffMilliseconds < ONE_DAY) {
    const hours = Math.floor(diffMilliseconds / ONE_HOUR);
    return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
  } else {
    return getDateFromMilliseconds(sendMilliseconds);
  }
}
