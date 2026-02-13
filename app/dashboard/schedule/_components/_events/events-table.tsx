"use client";

import { flexRender } from "@tanstack/react-table";
import { CalendarX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { UseDialogReturn } from "@/hooks";

import type { UseEventsReturn } from "../../_hooks";
import { useEventsTable } from "../../_hooks/use-events-table";
import type { Event } from "../../types";

type EventsTableProps = Pick<UseEventsReturn, "events" | "isLoading"> &
  Pick<UseDialogReturn<Event>, "handleSelectItem" | "handleKeyDown">;

const EventsTable = ({ events, isLoading, handleSelectItem, handleKeyDown }: EventsTableProps) => {
  const { table, eventsColumns } = useEventsTable(events);

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

  return (
    <div className="flex-1 space-y-4">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => handleSelectItem(row.original.id)}
                  onKeyDown={(e) => handleKeyDown(e, row.original.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View event: ${row.original.title}`}
                  className="cursor-pointer hover:bg-accent"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={eventsColumns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-muted-foreground text-sm">{table.getFilteredRowModel().rows.length} event(s) total.</div>
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventsTable;
