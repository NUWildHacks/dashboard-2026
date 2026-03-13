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
import { toast } from "sonner";

import { deletePermissionCodes } from "../_actions";
import { getPermissionCodesColumns } from "../_lib/client";
import { PermissionCode } from "../types";

export type UsePermissionCodesTableReturn = {
  table: Table<PermissionCode>;
  selectedPermissionCodeIds: PermissionCode["id"][];
  handleDeletePermissionCodes: (permissionCodeIds: PermissionCode["id"][]) => Promise<void>;
  permissionCodesColumns: ColumnDef<PermissionCode>[];
};

export const usePermissionCodesTable = (data: PermissionCode[]): UsePermissionCodesTableReturn => {
  const [sorting, setSorting] = useState<SortingState>([{ id: "created_at", desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const handleDeletePermissionCodes = async (permissionCodeIds: PermissionCode["id"][]) => {
    try {
      const result = await deletePermissionCodes(permissionCodeIds);
      const { success } = result;

      if (!success) {
        const { field, error } = result;

        if (!field) {
          throw new Error(error);
        }

        return;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Delete permission codes error:", errorMessage);

      toast.error("Failed to delete permission codes", { description: errorMessage });
    }
  };

  const permissionCodesColumns = getPermissionCodesColumns(handleDeletePermissionCodes);

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
    handleDeletePermissionCodes,
    permissionCodesColumns,
  };
};
