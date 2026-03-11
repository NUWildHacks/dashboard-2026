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
import { UseConfirmDeleteDialogReturn } from "@/hooks";
import { getDateFromMilliseconds, getTimeFromMilliseconds } from "@/lib";

import { PermissionCode } from "../types";

/**
 * Get permission codes table columns.
 * Returns columns for displaying permission codes in a table format.
 *
 * @param handleOpenConfirmDeleteDialog - Callback function to handle permission code deletion
 * @returns Array of column definitions for the permission codes table
 * @example
 * ```ts
 * const columns = getPermissionCodesColumns(handleOpenConfirmDeleteDialog);
 * ```
 */
export const getPermissionCodesColumns = (
  handleOpenConfirmDeleteDialog: UseConfirmDeleteDialogReturn<PermissionCode>["handleOpenConfirmDeleteDialog"]
): ColumnDef<PermissionCode>[] => {
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
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        return <div className="text-left text-muted-foreground">{row.original.id}</div>;
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return <div className="text-left text-muted-foreground">{row.original.email}</div>;
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
          <div className="text-left text-muted-foreground">{`${getDateFromMilliseconds(row.original.created_at)}, ${getTimeFromMilliseconds(row.original.created_at)}`}</div>
        );
      },
    },
    {
      accessorKey: "expires_at",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Expires At
            {column.getIsSorted() === "asc" ? <ChevronUp /> : <ChevronDown />}
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-left text-muted-foreground">{`${getDateFromMilliseconds(row.original.expires_at)}, ${getTimeFromMilliseconds(row.original.expires_at)}`}</div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        if (row.original.expires_at < Date.now()) {
          return (
            <Badge
              variant="outline"
              className="bg-destructive/10 [a&]:hover:bg-destructive/5 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive border-none focus-visible:outline-none"
            >
              Expired
            </Badge>
          );
        }
        return (
          <Badge
            variant="outline"
            className="border-none bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 focus-visible:outline-none dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 [a&]:hover:bg-green-600/5 dark:[a&]:hover:bg-green-400/5"
          >
            Active
          </Badge>
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>
                Copy permission code
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.email)}>
                Copy email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => handleOpenConfirmDeleteDialog([row.original.id])}>
                Delete permission code
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
