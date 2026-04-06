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

import { UseConfirmDeleteDialogReturn, UseItemDialogReturn } from "@/hooks";

import { getEventsColumns } from "../_lib";
import type { Event } from "../types";

import { UseEventFormDialogReturn } from ".";

export type UseEventsTableReturn = {
  table: Table<Event>;
  eventsColumns: ColumnDef<Event>[];
  selectedEventIds: Event["id"][];
};

export const useEventsTable = (
  events: Event[],
  handleSelectItem: UseItemDialogReturn<Event>["handleSelectItem"],
  handleOpenEventFormDialog: UseEventFormDialogReturn["handleOpenEventFormDialog"],
  handleOpenConfirmDeleteDialog: UseConfirmDeleteDialogReturn<Event>["handleOpenConfirmDeleteDialog"]
): UseEventsTableReturn => {
  const [sorting, setSorting] = useState<SortingState>([{ id: "start_time", desc: false }]);

  const eventsColumns = getEventsColumns(handleSelectItem, handleOpenEventFormDialog, handleOpenConfirmDeleteDialog);

  // eslint-disable-next-line react-hooks/incompatible-library
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
