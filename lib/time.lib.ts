import { MONTH_ABBREVIATIONS, ONE_DAY, ONE_HOUR, ONE_MINUTE } from "@/constants";

/**
 * Format a date from milliseconds to a readable string.
 *
 * @param milliseconds - Timestamp in milliseconds since epoch
 * @returns Formatted date string (e.g., "April 11, 2026")
 * @example
 * ```ts
 * const timestamp = new Date('2026-04-11').getTime();
 * const dateStr = getDateFromMilliseconds(timestamp);
 * // Returns: "April 11, 2026"
 * ```
 */
const getDateFromMilliseconds = (milliseconds: number) => {
  const date = new Date(milliseconds);

  return `${MONTH_ABBREVIATIONS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

/**
 * Format minutes (0-1440) to a 12-hour time string.
 *
 * @param time - Time in minutes from midnight (0-1440)
 * @returns Formatted time string (e.g., "8:00 AM", "2:30 PM")
 * @example
 * ```ts
 * const timeStr = getTimeFromMinutes(540); // 9:00 AM
 * // Returns: "9:00 AM"
 *
 * const timeStr2 = getTimeFromMinutes(870); // 2:30 PM
 * // Returns: "2:30 PM"
 * ```
 */
const getTimeFromMinutes = (time: number) => {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  return `${hours > 12 ? hours - 12 : hours}:${minutes.toString().padStart(2, "0")}${hours >= 12 ? " PM" : " AM"}`;
};

/**
 * Format milliseconds to a 12-hour time string.
 *
 * @param milliseconds - Timestamp in milliseconds since epoch
 * @returns Formatted time string (e.g., "8:00 AM", "2:30 PM")
 * @example
 * ```ts
 * const timestamp = new Date('2026-04-11T14:30:00').getTime();
 * const timeStr = getTimeFromMilliseconds(timestamp);
 * // Returns: "2:30 PM"
 * ```
 */
const getTimeFromMilliseconds = (milliseconds: number) => {
  const date = new Date(milliseconds);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours > 12 ? hours - 12 : hours || 12}:${minutes.toString().padStart(2, "0")}${hours >= 12 ? " PM" : " AM"}`;
};

/**
 * Format an event time range with date.
 * Returns format: "April 11, 8:00 AM - 5:00 PM"
 * Events are assumed to fit within one day.
 *
 * @param start_time - Event start time in milliseconds since epoch
 * @param end_time - Event end time in milliseconds since epoch
 * @returns Formatted time range string with date
 * @example
 * ```ts
 * const start = new Date('2026-04-11T08:00:00').getTime();
 * const end = new Date('2026-04-11T17:00:00').getTime();
 * const range = getEventTimeRange(start, end);
 * // Returns: "April 11, 8:00 AM - 5:00 PM"
 * ```
 */
const getEventTimeRange = (start_time: number, end_time: number) => {
  const startDate = new Date(start_time);
  const month = MONTH_ABBREVIATIONS[startDate.getMonth()];
  const day = startDate.getDate();
  const startTime = getTimeFromMilliseconds(start_time);
  const endTime = getTimeFromMilliseconds(end_time);

  return `${month} ${day}, ${startTime} - ${endTime}`;
};

/**
 * Format a relative time string from a past timestamp.
 * Returns human-readable relative time (e.g., "5 minutes ago", "2 hours ago", or a date).
 *
 * @param sendMilliseconds - Timestamp in milliseconds since epoch
 * @returns Relative time string or formatted date if more than a day ago
 * @example
 * ```ts
 * const now = Date.now();
 * const fiveMinutesAgo = now - 5 * 60 * 1000;
 * const timeStr = getSendTime(fiveMinutesAgo);
 * // Returns: "5 minutes ago"
 *
 * const twoDaysAgo = now - 2 * 24 * 60 * 60 * 1000;
 * const dateStr = getSendTime(twoDaysAgo);
 * // Returns: "April 9, 2026" (or similar formatted date)
 * ```
 */
const getSendTime = (sendMilliseconds: number) => {
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
};

export { getDateFromMilliseconds, getEventTimeRange, getSendTime, getTimeFromMilliseconds, getTimeFromMinutes };
