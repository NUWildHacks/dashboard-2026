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

import { UseDialogReturn } from "@/hooks";

import { getAnnouncementsColumns } from "../_lib/announcements-columns.lib";
import type { Announcement } from "../types";

export type UseAnnouncementsTableReturn = {
  table: Table<Announcement>;
  announcementsColumns: ColumnDef<Announcement>[];
  selectedAnnouncementIds: Announcement["id"][];
};

export const useAnnouncementsTable = (
  announcements: Announcement[],
  handleSelectItem: UseDialogReturn<Announcement>["handleSelectItem"],
  handleDeleteAnnouncements: (announcementIds: Announcement["id"][]) => Promise<void>
): UseAnnouncementsTableReturn => {
  const [sorting, setSorting] = useState<SortingState>([{ id: "created_at", desc: true }]);

  const announcementsColumns = getAnnouncementsColumns(handleSelectItem, handleDeleteAnnouncements);

  const table = useReactTable({
    data: announcements,
    columns: announcementsColumns,
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

  const selectedAnnouncementIds = table.getSelectedRowModel().rows.map((row) => row.original.id);

  return {
    table,
    announcementsColumns,
    selectedAnnouncementIds,
  };
};
