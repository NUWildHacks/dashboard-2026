"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { EventDialog, EventsList } from "@/app/dashboard/schedule/_components";
import { useEvents } from "@/app/dashboard/schedule/_hooks";
import type { Event } from "@/app/dashboard/schedule/_types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DASHBOARD_SCHEDULE_PATH } from "@/constants/routes.constants";
import { useDialog } from "@/hooks/use-dialog";
import { cn } from "@/lib/utils.lib";

const UpcomingEvents = () => {
  const useEventsReturn = useEvents({
    limitCount: 3,
  });

  const { upcomingEvents } = useEventsReturn;

  const useEventDialogReturn = useDialog<Event>(upcomingEvents);

  return (
    <>
      <Card className="shadow-xs row-span-3 md:col-span-2">
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>
            Don&apos;t miss what&apos;s next! Browse workshops, talks, and activities happening throughout WildHacks.
          </CardDescription>
        </CardHeader>
        <CardContent
          className={cn(
            "flex-1 flex flex-col justify-center gap-4",
            upcomingEvents.length === 0 ? "items-center" : "items-start"
          )}
        >
          <EventsList {...useEventsReturn} {...useEventDialogReturn} />
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
      <EventDialog {...useEventDialogReturn} />
    </>
  );
};

export default UpcomingEvents;
