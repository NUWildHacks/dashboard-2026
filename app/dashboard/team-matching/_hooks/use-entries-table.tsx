"use client";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type Table,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";

import type { IntakeEntry } from "../_lib/lib";

const COLUMNS: ColumnDef<IntakeEntry>[] = [
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "experience_level",
    header: "Experience",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.experience_level}
      </Badge>
    ),
  },
  {
    accessorKey: "preferred_roles",
    header: "Roles",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.preferred_roles.map((r) => (
          <Badge key={r} variant="secondary" className="text-xs">
            {r.replace(" Engineer", "").replace(" Scientist", "")}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "work_style",
    header: "Work style",
    cell: ({ row }) => (
      <span className="capitalize text-sm text-muted-foreground">{row.original.work_style.replace("_", " ")}</span>
    ),
  },
  {
    accessorKey: "preferred_team_size",
    header: "Size",
    cell: ({ row }) => <span className="text-sm">{row.original.preferred_team_size}</span>,
  },
  {
    accessorKey: "required_teammates",
    header: "Required",
    cell: ({ row }) => {
      const names = row.original.required_teammate_names;
      if (!names || names.length === 0) return <span className="text-sm text-muted-foreground">—</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {names.map((name) => (
            <Badge key={name} variant="outline" className="text-xs">
              {name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "gender_preference",
    header: "Gender pref",
    cell: ({ row }) => {
      const v = row.original.gender_preference;
      return (
        <span className="text-sm text-muted-foreground">
          {v === "prefer_mixed" ? "Mixed" : v === "prefer_same" ? "Same" : "No pref"}
        </span>
      );
    },
  },
  {
    accessorKey: "where_staying",
    header: "Stay",
    cell: ({ row }) => {
      const v = row.original.where_staying;
      return (
        <span className="text-sm text-muted-foreground">
          {v === "on_site" ? "On-site" : v === "off_campus" ? "Off Campus" : "On Campus"}
        </span>
      );
    },
  },
];

export type UseEntriesTableReturn = {
  search: string;
  setSearch: (search: string) => void;
  table: Table<IntakeEntry>;
  columns: ColumnDef<IntakeEntry>[];
};

export const useEntriesTable = (entries: IntakeEntry[]): UseEntriesTableReturn => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      entries.filter(
        (e) =>
          e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.preferred_roles.some((r) => r.toLowerCase().includes(search.toLowerCase()))
      ),
    [entries, search]
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filtered,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  });

  return { search, setSearch, table, columns: COLUMNS };
};
