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

/**
 * Convert milliseconds to a Date object.
 *
 * @param milliseconds - Timestamp in milliseconds since epoch
 * @returns Date object or undefined if invalid
 * @example
 * ```ts
 * const timestamp = new Date('2026-04-11T08:00:00').getTime();
 * const date = millisecondsToDate(timestamp);
 * // Returns: Date object for April 11, 2026 at 8:00 AM
 * ```
 */
const millisecondsToDate = (milliseconds: number): Date | undefined => {
  if (!milliseconds || milliseconds <= 0) return undefined;
  return new Date(milliseconds);
};

/**
 * Convert Date and time string to milliseconds.
 *
 * @param date - Date object
 * @param time - Time string in HH:mm format
 * @returns Timestamp in milliseconds since epoch
 * @example
 * ```ts
 * const date = new Date('2026-04-11');
 * const time = "14:30";
 * const timestamp = combineDateAndTime(date, time);
 * // Returns: milliseconds for April 11, 2026 at 2:30 PM
 * ```
 */
const combineDateAndTime = (date: Date | undefined, time: string): number => {
  if (!date || !time) return 0;
  const [hours, minutes] = time.split(":").map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined.getTime();
};

/**
 * Convert milliseconds to a time string in HH:mm format.
 *
 * @param milliseconds - Timestamp in milliseconds since epoch
 * @returns Time string in HH:mm format (e.g., "14:30")
 * @example
 * ```ts
 * const timestamp = new Date('2026-04-11T14:30:00').getTime();
 * const timeStr = millisecondsToTime(timestamp);
 * // Returns: "14:30"
 * ```
 */
const millisecondsToTime = (milliseconds: number): string => {
  if (!milliseconds || milliseconds <= 0) return "";
  const date = new Date(milliseconds);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

/**
 * Parse a date label string to a Date object.
 * Parses format: "Mar 10, 2026" (abbreviated month from MONTH_ABBREVIATIONS)
 *
 * @param dateLabel - Date string in format "Month Day, Year" (e.g., "Mar 10, 2026")
 * @returns Date object or undefined if invalid
 * @example
 * ```ts
 * const date = parseDateLabel("Mar 10, 2026");
 * // Returns: Date object for March 10, 2026
 * ```
 */
const parseDateLabel = (dateLabel: string): Date | undefined => {
  if (!dateLabel) return undefined;

  // Format: "Mar 10, 2026"
  const parts = dateLabel.split(" ");
  if (parts.length !== 3) return undefined;

  const monthAbbr = parts[0];
  const day = parseInt(parts[1].replace(",", ""), 10);
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(year)) return undefined;

  const monthIndex = MONTH_ABBREVIATIONS.indexOf(monthAbbr as (typeof MONTH_ABBREVIATIONS)[number]);
  if (monthIndex === -1) return undefined;

  const date = new Date(year, monthIndex, day);
  // Validate the date is valid (handles cases like Feb 30)
  if (date.getDate() !== day || date.getMonth() !== monthIndex || date.getFullYear() !== year) {
    return undefined;
  }

  return date;
};

export {
  combineDateAndTime,
  getDateFromMilliseconds,
  getTimeFromMilliseconds,
  getEventTimeRange,
  getSendTime,
  getTimeFromMinutes,
  millisecondsToDate,
  millisecondsToTime,
  parseDateLabel,
};
