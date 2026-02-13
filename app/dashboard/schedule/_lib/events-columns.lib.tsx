"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronUp, ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEventTimeRange } from "@/lib";

import type { Event } from "../types";

/**
 * Get events table columns.
 * Returns columns for displaying events in a table format.
 *
 * @returns Array of column definitions for the events table
 * @example
 * ```ts
 * const columns = getEventsColumns();
 * ```
 */
export const getEventsColumns = (): ColumnDef<Event>[] => {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Title
            {column.getIsSorted() === "asc" ? <ChevronUp /> : <ChevronDown />}
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="text-left text-muted-foreground">{row.original.title}</div>;
      },
    },
    {
      accessorKey: "start_time",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Time
            {column.getIsSorted() === "asc" ? <ChevronUp /> : <ChevronDown />}
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-left text-muted-foreground">
            {getEventTimeRange(row.original.start_time, row.original.end_time)}
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Category
            {column.getIsSorted() === "asc" ? <ChevronUp /> : <ChevronDown />}
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-left">
            <Badge variant="secondary">{row.original.category}</Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "location",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Location
            {column.getIsSorted() === "asc" ? <ChevronUp /> : <ChevronDown />}
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="text-left text-muted-foreground">{row.original.location}</div>;
      },
    },
  ];
};
