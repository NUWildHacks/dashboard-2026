"use client";

import { ArrowRight, CalendarX } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { DASHBOARD_SCHEDULE_PATH } from "@/constants/routes";

export default function UpcomingEvents() {
  const [events, _setEvents] = useState<string[]>([]);

  return (
    <Card className="shadow-none row-span-3 md:col-span-2">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>
          Don&apos;t miss what&apos;s next! Browse workshops, talks, and activities happening throughout WildHacks.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {events.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CalendarX />
              </EmptyMedia>
              <EmptyTitle>No upcoming events</EmptyTitle>
              <EmptyDescription>Check back in closer to the event start date.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            {events.map((event) => (
              <div key={event}>{event}</div>
            ))}
          </>
        )}
      </CardContent>
      <CardFooter className="flex-row-reverse">
        <Link href={DASHBOARD_SCHEDULE_PATH}>
          <Button variant="link">
            View all events
            <ArrowRight />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
