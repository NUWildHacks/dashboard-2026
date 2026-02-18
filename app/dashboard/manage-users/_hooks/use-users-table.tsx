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
import { json2csv } from "json-2-csv";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PARTICIPANT } from "@/constants";
import { User } from "@/types";

import { deleteUsers } from "../_actions";
import { getUsersColumns } from "../_lib/users-columns.lib";

export type UseUsersTableReturn = {
  role: User["role"];
  setRole: (role: User["role"]) => void;
  search: string;
  setSearch: (search: string) => void;
  table: Table<User>;
  selectedUserIds: User["id"][];
  handleDeleteUsers: (userIds: User["id"][]) => Promise<void>;
  usersColumns: ColumnDef<User>[];
  handleDownloadCSV: () => void;
};

export const useUsersTable = (data: User[]): UseUsersTableReturn => {
  const [role, setRole] = useState<User["role"]>(PARTICIPANT);
  const [search, setSearch] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "created_at", desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const filteredUsers = useMemo(() => {
    let result = data;

    result = result.filter((user) => user.role === role);

    if (search && search !== "") {
      const searchLower = search.toLowerCase();
      result = result.filter((user) => {
        return (
          user.first_name.toLowerCase().includes(searchLower) ||
          user.last_name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
        );
      });
    }

    return result;
  }, [data, role, search]);

  const handleDownloadCSV = () => {
    const csv = json2csv(filteredUsers);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${role}-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteUsers = async (userIds: User["id"][]) => {
    try {
      const result = await deleteUsers(userIds);
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
      console.error("Delete users error:", errorMessage);

      toast.error("Failed to delete users", { description: errorMessage });
    }
  };

  const usersColumns = getUsersColumns(role, handleDeleteUsers);

  const table = useReactTable({
    data: filteredUsers,
    columns: usersColumns,
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

  const selectedUserIds = table.getFilteredSelectedRowModel().rows.map((row) => (row.original as User).id);

  return {
    role,
    setRole,
    search,
    setSearch,
    table,
    selectedUserIds,
    handleDeleteUsers,
    usersColumns,
    handleDownloadCSV,
  };
};
