"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronUp, ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Project } from "../../judging/types";

/**
 * Get projects table columns.
 * Returns columns for displaying projects in a table format.
 *
 * @returns Array of column definitions for the projects table
 * @example
 * ```ts
 * const columns = getProjectsColumns();
 * ```
 */
export const getProjectsColumns = (): ColumnDef<Project>[] => {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Project Name
            {column.getIsSorted() === "asc" ? <ChevronUp /> : <ChevronDown />}
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="text-left text-muted-foreground">{row.original.name}</div>;
      },
    },
    {
      accessorKey: "track",
      header: "Track",
      cell: ({ row }) => {
        return <Badge variant="secondary">{row.original.track}</Badge>;
      },
    },
    {
      accessorKey: "project_url",
      header: "Project URL",
      cell: ({ row }) => {
        return (
          <a
            href={row.original.project_url}
            target="_blank"
            rel="noreferrer"
            className="underline-offset-4 hover:underline"
          >
            {row.original.project_url}
          </a>
        );
      },
    },
  ];
};
