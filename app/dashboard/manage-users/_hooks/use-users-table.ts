"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import Papa from "papaparse";
import { useMemo, useState } from "react";

import { PARTICIPANT } from "@/constants";
import {
  UseConfirmDeleteDialogReturn,
  useFilters,
} from "@/hooks";
import { User } from "@/types";

import { getUsersColumns } from "../_lib/client";

export type UseUsersTableReturn = {
  role: User["role"];
  setRole: (role: User["role"]) => void;
  search: string;
  setSearch: (search: string) => void;
  table: Table<User>;
  /** Every selected user, including users that the role filter or the search hides. */
  selectedUsers: User[];
  selectedUserIds: User["id"][];
  usersColumns: ColumnDef<User>[];
  handleDownloadCSV: () => void;
};

export const useUsersTable = (
  data: User[],
  handleOpenConfirmDeleteDialog: UseConfirmDeleteDialogReturn<User>["handleOpenConfirmDeleteDialog"]
): UseUsersTableReturn => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "created_at", desc: true },
  ]);
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({});

  const {
    category: role,
    setCategory: setRole,
    search,
    setSearch,
  } = useFilters<User["role"]>({
    includeAll: false,
    defaultCategory: PARTICIPANT,
  });

  const filteredUsers = useMemo(() => {
    let result = data;

    result = result.filter((user) => user.role === role);

    if (search && search !== "") {
      const searchLower = search.toLowerCase();
      result = result.filter((user) => {
        return (
          user.first_name
            .toLowerCase()
            .includes(searchLower) ||
          user.last_name
            .toLowerCase()
            .includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
        );
      });
    }

    return result;
  }, [data, role, search]);

  const handleDownloadCSV = () => {
    const csv = Papa.unparse(filteredUsers);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${role}-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const usersColumns = getUsersColumns(
    role,
    handleOpenConfirmDeleteDialog
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredUsers,
    columns: usersColumns,
    // Key the selection by user id, not by row position, so a selection always means the same
    // users after the list changes (filter, search, or a refresh after a delete).
    getRowId: (user) => user.id,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
    },
  });

  // Read the selection from all users, not from the table rows: the table holds only the users
  // that the role filter and the search show. Users that no longer exist (for example, after a
  // delete) drop out because they are not in `data`.
  const selectedUsers = useMemo(
    () => data.filter((user) => rowSelection[user.id]),
    [data, rowSelection]
  );
  const selectedUserIds = selectedUsers.map(
    (user) => user.id
  );

  return {
    role,
    setRole,
    search,
    setSearch,
    table,
    selectedUsers,
    selectedUserIds,
    usersColumns,
    handleDownloadCSV,
  };
};
