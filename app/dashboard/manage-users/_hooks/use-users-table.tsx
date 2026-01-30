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
import { ChevronUp, ChevronDown, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PARTICIPANT } from "@/constants";
import { getDateFromMilliseconds, getTimeFromMilliseconds } from "@/lib";
import { User } from "@/types";

import { deleteUsers } from "../_actions";

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
  const [sorting, setSorting] = useState<SortingState>([]);
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

  const usersColumns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "first_name",
      header: "First Name",
      cell: ({ row }) => {
        return <div className="text-left text-muted-foreground">{row.original.first_name}</div>;
      },
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
      cell: ({ row }) => {
        return <div className="text-left text-muted-foreground">{row.original.last_name}</div>;
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return <div className="text-left text-muted-foreground">{row.original.email}</div>;
      },
    },
    {
      accessorKey: "dietary_restrictions",
      header: "Dietary Restrictions",
      cell: ({ row }) => {
        return (
          <div className="text-left text-muted-foreground">
            {row.original.dietary_restrictions.length > 0 ? row.original.dietary_restrictions.join(", ") : "None"}
          </div>
        );
      },
    },
    {
      accessorKey: "other_dietary_restrictions",
      header: "Other Dietary Restrictions",
      cell: ({ row }) => {
        return (
          <div className="text-left text-muted-foreground">{row.original.other_dietary_restrictions || "None"}</div>
        );
      },
    },
    {
      accessorKey: "tshirt_size",
      header: "T-Shirt Size",
      cell: ({ row }) => {
        return <Badge variant="secondary">{row.original.tshirt_size}</Badge>;
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Joined At
            {column.getIsSorted() === "asc" ? <ChevronUp /> : <ChevronDown />}
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-left text-muted-foreground">{`${getDateFromMilliseconds(row.original.created_at)}, ${getTimeFromMilliseconds(row.original.created_at)}`}</div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: () => null,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-sm font-bold">Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.email)}>
                Copy email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => handleDeleteUsers([row.original.id])}>
                Delete user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

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
