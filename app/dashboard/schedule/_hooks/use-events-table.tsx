"use client";

import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { getEventsColumns } from "../_lib/events-columns.lib";
import type { Event } from "../types";

export type UseEventsTableReturn = {
  table: Table<Event>;
  eventsColumns: ColumnDef<Event>[];
};

export const useEventsTable = (events: Event[]): UseEventsTableReturn => {
  const [sorting, setSorting] = useState<SortingState>([{ id: "start_time", desc: false }]);

  const eventsColumns = useMemo(() => getEventsColumns(), []);

  const table = useReactTable({
    data: events,
    columns: eventsColumns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
    state: {
      sorting,
    },
  });

  return {
    table,
    eventsColumns,
  };
};
