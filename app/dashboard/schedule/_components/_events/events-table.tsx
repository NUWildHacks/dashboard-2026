"use client";

import { CalendarX } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";

import type { UseEventsReturn, UseEventsTableReturn } from "../../_hooks";

type EventsTableProps = Pick<UseEventsReturn, "events" | "isLoading"> &
  Pick<UseEventsTableReturn, "table" | "eventsColumns">;

const EventsTable = ({ events, isLoading, table, eventsColumns }: EventsTableProps) => {
  if (isLoading) {
    return (
      <>
        <span className="sr-only">Loading events, please wait</span>
        <Skeleton className="h-[80px] w-full" aria-hidden="true" />
        <Skeleton className="h-[80px] w-full" aria-hidden="true" />
        <Skeleton className="h-[80px] w-full" aria-hidden="true" />
      </>
    );
  }

  if (events.length === 0) {
    return (
      <Empty role="status" aria-live="polite">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CalendarX aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No upcoming events</EmptyTitle>
          <EmptyDescription>More events will be added in the future. Check back soon!</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return <DataTable columns={eventsColumns} table={table} />;
};

export default EventsTable;
