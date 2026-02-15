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
import { useState } from "react";

import { UseItemDialogReturn } from "@/hooks";

import { getEventsColumns } from "../_lib/events-columns.lib";
import type { Event } from "../types";

import { UseEventFormDialogReturn } from "./use-event-form-dialog";

export type UseEventsTableReturn = {
  table: Table<Event>;
  eventsColumns: ColumnDef<Event>[];
  selectedEventIds: Event["id"][];
};

export const useEventsTable = (
  events: Event[],
  handleSelectItem: UseItemDialogReturn<Event>["handleSelectItem"],
  handleOpenEventFormDialog: UseEventFormDialogReturn["handleOpenEventFormDialog"],
  handleDeleteEvents: (eventIds: Event["id"][]) => Promise<void>
): UseEventsTableReturn => {
  const [sorting, setSorting] = useState<SortingState>([{ id: "start_time", desc: false }]);

  const eventsColumns = getEventsColumns(handleSelectItem, handleOpenEventFormDialog, handleDeleteEvents);

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

  const selectedEventIds = table.getSelectedRowModel().rows.map((row) => row.original.id);

  return {
    table,
    eventsColumns,
    selectedEventIds,
  };
};
