"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DASHBOARD_SCHEDULE_PATH } from "@/constants/routes";
import { cn } from "@/lib/utils";

import { useEventDialog } from "../../_hooks/use-event-dialog";
import { useEvents } from "../../_hooks/use-events";

import EventDialog from "./event-dialog";
import EventsList from "./events-list";

const UpcomingEvents = () => {
  const useEventsReturn = useEvents({
    limitCount: 3,
  });
  const { events } = useEventsReturn;

  const useEventDialogReturn = useEventDialog(events);

  return (
    <>
      <Card className="shadow-none row-span-3 md:col-span-2">
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>
            Don&apos;t miss what&apos;s next! Browse workshops, talks, and activities happening throughout WildHacks.
          </CardDescription>
        </CardHeader>
        <CardContent
          className={cn(
            "flex-1 flex flex-col justify-center gap-4",
            events.length === 0 ? "items-center" : "items-start"
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
