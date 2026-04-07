"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronUp, ChevronDown, MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UseConfirmDeleteDialogReturn, UseItemDialogReturn } from "@/hooks";
import { getEventTimeRange } from "@/lib";

import { UseEventFormDialogReturn } from "../_hooks";
import type { Event } from "../types";

/**
 * Get events table columns.
 * Returns columns for displaying events in a table format.
 *
 * @param handleSelectItem - Callback function to handle item selection
 * @param handleOpenEventFormDialog - Callback function to handle event form dialog
 * @param handleOpenConfirmDeleteDialog - Callback function to handle event deletion
 * @returns Array of column definitions for the events table
 * @example
 * ```ts
 * const columns = getEventsColumns(handleSelectItem, handleOpenEventFormDialog, handleOpenConfirmDeleteDialog);
 * ```
 */
export const getEventsColumns = (
  handleSelectItem: UseItemDialogReturn<Event>["handleSelectItem"],
  handleOpenEventFormDialog: UseEventFormDialogReturn["handleOpenEventFormDialog"],
  handleOpenConfirmDeleteDialog: UseConfirmDeleteDialogReturn<Event>["handleOpenConfirmDeleteDialog"]
): ColumnDef<Event>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
      header: "Category",
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
      header: "Location",
      cell: ({ row }) => {
        return <div className="text-left text-muted-foreground">{row.original.location}</div>;
      },
    },
    {
      accessorKey: "actions",
      header: () => null,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-sm font-bold">Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleSelectItem(row.original.id)}>View event</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOpenEventFormDialog(row.original)}>Edit event</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>
                Copy event ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.title)}>
                Copy event title
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.location)}>
                Copy event location
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => handleOpenConfirmDeleteDialog([row.original.id])}>
                Delete event
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
