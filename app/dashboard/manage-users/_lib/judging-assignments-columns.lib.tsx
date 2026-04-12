"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronUp, ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { JudgingAssignmentWithProject } from "../../judging/types";

/**
 * Get judging assignments table columns.
 * Returns columns for displaying judging assignments in a table format.
 *
 * @returns Array of column definitions for the judging assignments table
 * @example
 * ```ts
 * const columns = getJudgingAssignmentsColumns();
 * ```
 */
export const getJudgingAssignmentsColumns = (): ColumnDef<JudgingAssignmentWithProject>[] => {
  return [
    {
      id: "project.name",
      accessorKey: "project.name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Project Name
            {column.getIsSorted() === "asc" ? <ChevronUp /> : <ChevronDown />}
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="text-left text-muted-foreground">{row.original.project.name}</div>;
      },
    },
    {
      accessorKey: "project.track",
      header: "Track",
      cell: ({ row }) => {
        return <Badge variant="secondary">{row.original.project.track}</Badge>;
      },
    },
    {
      accessorKey: "project.devpost_url",
      header: "Devpost URL",
      cell: ({ row }) => {
        return (
          <a
            href={row.original.project.devpost_url}
            target="_blank"
            rel="noreferrer"
            className="underline-offset-4 hover:underline"
          >
            {row.original.project.devpost_url}
          </a>
        );
      },
    },
    {
      accessorKey: "order",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Order
            {column.getIsSorted() === "asc" ? <ChevronUp /> : <ChevronDown />}
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="text-left text-muted-foreground">{row.original.order}</div>;
      },
    },
    {
      header: "Status",
      cell: ({ row }) => {
        if (!row.original.judging_form) {
          return (
            <Badge
              variant="outline"
              className="bg-destructive/10 [a&]:hover:bg-destructive/5 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive border-none focus-visible:outline-none"
            >
              Not Submitted
            </Badge>
          );
        }
        return (
          <Badge
            variant="outline"
            className="border-none bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 focus-visible:outline-none dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 [a&]:hover:bg-green-600/5 dark:[a&]:hover:bg-green-400/5"
          >
            Submitted
          </Badge>
        );
      },
    },
  ];
};
