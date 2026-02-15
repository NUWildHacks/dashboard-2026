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
import { UseItemDialogReturn } from "@/hooks";
import { getDateFromMilliseconds } from "@/lib";

import { UseAnnouncementsReturn } from "../_hooks";
import type { Announcement } from "../types";

/**
 * Get announcements table columns.
 * Returns columns for displaying announcements in a table format.
 *
 * @returns Array of column definitions for the announcements table
 * @example
 * ```ts
 * const columns = getAnnouncementsColumns();
 * ```
 */
export const getAnnouncementsColumns = (
  handleSelectItem: UseItemDialogReturn<Announcement>["handleSelectItem"],
  handleDeleteAnnouncements: UseAnnouncementsReturn["handleDeleteAnnouncements"]
): ColumnDef<Announcement>[] => {
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
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Created At
            {column.getIsSorted() === "asc" ? <ChevronUp /> : <ChevronDown />}
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-left text-muted-foreground">{getDateFromMilliseconds(row.original.created_at)}</div>
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
              <DropdownMenuItem onClick={() => handleSelectItem(row.original.id)}>View announcement</DropdownMenuItem>
              <DropdownMenuItem>Edit announcement</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>
                Copy announcement ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.title)}>
                Copy announcement title
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => handleDeleteAnnouncements([row.original.id])}>
                Delete announcement
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
