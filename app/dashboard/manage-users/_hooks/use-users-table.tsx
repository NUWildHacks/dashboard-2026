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
import { useRouter } from "next/navigation";
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
};

export const useUsersTable = (data: User[]): UseUsersTableReturn => {
  const router = useRouter();

  const [role, setRole] = useState<User["role"]>(PARTICIPANT);
  const [search, setSearch] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "created_at", desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

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

      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Delete permission codes error:", errorMessage);

      toast.error("Failed to delete permission codes", { description: errorMessage });
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
    state: {
      sorting,
      columnFilters,
      rowSelection,
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
  };
};
