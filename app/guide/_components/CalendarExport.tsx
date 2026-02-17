"use client";

import type { CalendarEvent } from "./calendar-utils";
import { downloadICS, generateGoogleCalendarURLForEvents } from "./calendar-utils";

type CalendarExportProps = {
  readonly events: CalendarEvent[];
  readonly calendarName?: string;
};

const formatFilename = (calendarName: string) =>
  `${calendarName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}.ics`;

const CalendarExport = ({ events, calendarName = "WildHacks 2026" }: CalendarExportProps) => {
  if (events.length === 0) {
    return null;
  }

  const filename = formatFilename(calendarName);

  const handleDownloadICS = () => {
    downloadICS(events, filename);
  };

  const handleOpenGoogleCalendar = () => {
    if (events.length === 1) {
      window.open(generateGoogleCalendarURLForEvents(events), "_blank", "noopener");
      return;
    }

    downloadICS(events, filename);
    window.open("https://calendar.google.com/calendar/u/0/r/settings/import", "_blank", "noopener");
  };

  return (
    <section className="guide-calendar">
      <header className="guide-calendar-header">
        <h3>📅 Add to Calendar</h3>
        <p>Add every WildHacks 2026 milestone to your personal calendar.</p>
      </header>
      <div className="guide-calendar-actions">
        <button type="button" className="guide-button guide-button-primary" onClick={handleDownloadICS}>
          <span aria-hidden>📥</span>
          <span>Download .ics File</span>
        </button>
        <button type="button" className="guide-button guide-button-secondary" onClick={handleOpenGoogleCalendar}>
          <span aria-hidden>📆</span>
          <span>Add to Google Calendar</span>
        </button>
      </div>
      <p className="guide-calendar-footnote">
        {events.length > 1
          ? `The .ics file contains ${events.length} events and works with Google Calendar, Apple Calendar, Outlook, and more. When adding to Google Calendar we automatically download the file and open the import page for you.`
          : "We will open Google Calendar with the event details pre-filled so you can save it immediately."}
      </p>
    </section>
  );
};

export default CalendarExport;
