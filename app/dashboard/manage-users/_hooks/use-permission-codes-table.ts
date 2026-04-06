"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import { UseConfirmDeleteDialogReturn } from "@/hooks";

import { getPermissionCodesColumns } from "../_lib/client";
import { PermissionCode } from "../types";

export type UsePermissionCodesTableReturn = {
  table: Table<PermissionCode>;
  selectedPermissionCodeIds: PermissionCode["id"][];
  permissionCodesColumns: ColumnDef<PermissionCode>[];
};

export const usePermissionCodesTable = (
  data: PermissionCode[],
  handleOpenConfirmDeleteDialog: UseConfirmDeleteDialogReturn<PermissionCode>["handleOpenConfirmDeleteDialog"]
): UsePermissionCodesTableReturn => {
  const [sorting, setSorting] = useState<SortingState>([{ id: "created_at", desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const permissionCodesColumns = getPermissionCodesColumns(handleOpenConfirmDeleteDialog);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: permissionCodesColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  const selectedPermissionCodeIds = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => (row.original as PermissionCode).id);

  return {
    table,
    selectedPermissionCodeIds,
    permissionCodesColumns,
  };
};
