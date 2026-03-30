export type CalendarEvent = {
  readonly title: string;
  readonly description?: string;
  readonly start: Date;
  readonly end: Date;
  readonly location?: string;
  readonly url?: string;
};

const escapeICS = (text: string) =>
  text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

const formatICSDate = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
};

export const generateICS = (events: CalendarEvent[], calendarName = "WildHacks 2026") => {
  let ics = "BEGIN:VCALENDAR\r\n";
  ics += "VERSION:2.0\r\n";
  ics += "PRODID:-//WildHacks//Guide 2026//EN\r\n";
  ics += `X-WR-CALNAME:${escapeICS(calendarName)}\r\n`;
  ics += "CALSCALE:GREGORIAN\r\n";
  ics += "METHOD:PUBLISH\r\n";

  events.forEach((event, index) => {
    ics += "BEGIN:VEVENT\r\n";
    ics += `UID:${Date.now()}-${index}-${Math.random().toString(36).slice(2, 11)}@wildhacks.net\r\n`;
    ics += `DTSTAMP:${formatICSDate(new Date())}\r\n`;
    ics += `DTSTART:${formatICSDate(event.start)}\r\n`;
    ics += `DTEND:${formatICSDate(event.end)}\r\n`;
    ics += `SUMMARY:${escapeICS(event.title)}\r\n`;

    if (event.description) {
      ics += `DESCRIPTION:${escapeICS(event.description)}\r\n`;
    }

    if (event.location) {
      ics += `LOCATION:${escapeICS(event.location)}\r\n`;
    }

    if (event.url) {
      ics += `URL:${event.url}\r\n`;
    }

    ics += "END:VEVENT\r\n";
  });

  ics += "END:VCALENDAR\r\n";

  return ics;
};

const makeAbsoluteURL = (url: string | undefined, baseURL: string) => {
  if (!url) {
    return undefined;
  }

  const normalized = url.trim().toLowerCase();
  const isCalendarSubscriptionURL =
    normalized.startsWith("webcal://") ||
    normalized.includes("/calendar/ical/") ||
    normalized.includes("calendar.google.com/calendar/embed?src=") ||
    normalized.includes("calendar.google.com/calendar/u/0?cid=") ||
    /\.ics($|[?#])/.test(normalized);

  if (isCalendarSubscriptionURL) {
    return undefined;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const base = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
  const path = url.startsWith("/") ? url : `/${url}`;

  return `${base}${path}`;
};

export const downloadICS = (events: CalendarEvent[], filename = "wildhacks-2026.ics") => {
  const baseURL = typeof window !== "undefined" ? window.location.origin : "";
  const eventsWithAbsoluteURLs = events.map((event) => ({
    ...event,
    url: makeAbsoluteURL(event.url, baseURL),
  }));

  const icsContent = generateICS(eventsWithAbsoluteURLs);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const formatGoogleDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
};

export const generateGoogleCalendarURL = (event: CalendarEvent) => {
  const params = new URLSearchParams();
  params.set("action", "TEMPLATE");
  params.set("text", event.title);
  params.set("dates", `${formatGoogleDate(event.start)}/${formatGoogleDate(event.end)}`);

  if (event.location) {
    params.set("location", event.location);
  }

  if (event.description) {
    params.set("details", event.description);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const generateGoogleCalendarURLForEvents = (events: CalendarEvent[]) => {
  if (events.length === 0) {
    return "https://calendar.google.com/calendar/render";
  }

  return generateGoogleCalendarURL(events[0]);
};

export const parseTimeRange = (timeStr: string, date: Date) => {
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);

  if (!timeMatch) {
    const singleTimeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);

    if (singleTimeMatch) {
      const hour = parseInt(singleTimeMatch[1], 10);
      const minute = parseInt(singleTimeMatch[2], 10);
      const isPM = singleTimeMatch[3].toUpperCase() === "PM";
      const hour24 = hour === 12 ? (isPM ? 12 : 0) : isPM ? hour + 12 : hour;
      const start = new Date(date);
      start.setHours(hour24, minute, 0, 0);
      const end = new Date(start);
      end.setHours(end.getHours() + 1);
      return { start, end } as const;
    }

    return null;
  }

  const startHour = parseInt(timeMatch[1], 10);
  const startMinute = parseInt(timeMatch[2], 10);
  const startIsPM = timeMatch[3].toUpperCase() === "PM";
  const endHour = parseInt(timeMatch[4], 10);
  const endMinute = parseInt(timeMatch[5], 10);
  const endIsPM = timeMatch[6].toUpperCase() === "PM";

  const startHour24 = startHour === 12 ? (startIsPM ? 12 : 0) : startIsPM ? startHour + 12 : startHour;
  const endHour24 = endHour === 12 ? (endIsPM ? 12 : 0) : endIsPM ? endHour + 12 : endHour;

  const start = new Date(date);
  start.setHours(startHour24, startMinute, 0, 0);

  const end = new Date(date);
  end.setHours(endHour24, endMinute, 0, 0);

  return { start, end } as const;
};

export const parseDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return Number.isNaN(date.getTime()) ? null : date;
};
