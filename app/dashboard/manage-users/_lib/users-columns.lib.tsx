"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChevronUp, ChevronDown, MoreHorizontal } from "lucide-react";

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
import { JUDGE, MENTOR, PARTICIPANT } from "@/constants";
import { getDateFromMilliseconds, getTimeFromMilliseconds } from "@/lib";
import type { User } from "@/types";

/**
 * Get users table columns based on role.
 * Returns different columns for different user roles.
 *
 * @param role - The user role to determine which columns to show
 * @param handleDeleteUsers - Callback function to handle user deletion
 * @returns Array of column definitions for the users table
 * @example
 * ```ts
 * const columns = getUsersColumns(PARTICIPANT, handleDeleteUsers);
 * ```
 */
export const getUsersColumns = (
  role: User["role"],
  handleDeleteUsers: (userIds: User["id"][]) => Promise<void>
): ColumnDef<User>[] => {
  const identificationColumns: ColumnDef<User>[] = [
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
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            First Name
            {column.getIsSorted() === "asc" ? <ChevronUp /> : <ChevronDown />}
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="text-left text-muted-foreground">{row.original.first_name}</div>;
      },
      enableHiding: false,
    },
    {
      accessorKey: "last_name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Last Name
            {column.getIsSorted() === "asc" ? <ChevronUp /> : <ChevronDown />}
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="text-left text-muted-foreground">{row.original.last_name}</div>;
      },
      enableHiding: false,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        return <div className="text-left text-muted-foreground">{row.original.email}</div>;
      },
      enableHiding: false,
    },
  ];

  const roleSpecificColumns: ColumnDef<User>[] = [];
  const roleSpecificMetadataColumns: ColumnDef<User>[] = [];

  if (role === PARTICIPANT) {
    roleSpecificColumns.push({
      accessorKey: "github_username",
      header: "GitHub Username",
      cell: ({ row }) => {
        const user = row.original;
        if (user.role === PARTICIPANT) {
          return <div className="text-left text-muted-foreground">{user.github_username || "None"}</div>;
        }
        return null;
      },
      enableHiding: false,
    });
  } else if (role === JUDGE || role === MENTOR) {
    roleSpecificColumns.push(
      {
        accessorKey: "affiliated_company",
        header: "Affiliated Company",
        cell: ({ row }) => {
          const user = row.original;
          if (user.role === JUDGE || user.role === MENTOR) {
            return <div className="text-left text-muted-foreground">{user.affiliated_company}</div>;
          }
          return null;
        },
        enableHiding: false,
      },
      {
        accessorKey: "modality",
        header: "Modality",
        cell: ({ row }) => {
          const user = row.original;
          if (user.role === JUDGE || user.role === MENTOR) {
            return <Badge variant="secondary">{user.modality}</Badge>;
          }
          return null;
        },
        enableHiding: false,
      }
    );

    roleSpecificMetadataColumns.push({
      accessorKey: "updated_at",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Onboarded
            {column.getIsSorted() === "asc" ? <ChevronUp /> : <ChevronDown />}
          </Button>
        );
      },
      cell: ({ row }) => {
        const user = row.original;
        if (user.role === JUDGE || user.role === MENTOR) {
          if (user.onboarded) {
            return (
              <Badge
                variant="outline"
                className="border-none bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 focus-visible:outline-none dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 [a&]:hover:bg-green-600/5 dark:[a&]:hover:bg-green-400/5"
              >
                Yes
              </Badge>
            );
          } else {
            return (
              <Badge
                variant="outline"
                className="bg-destructive/10 [a&]:hover:bg-destructive/5 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive border-none focus-visible:outline-none"
              >
                No
              </Badge>
            );
          }
        }
        return (
          <div className="text-left text-muted-foreground">{`${getDateFromMilliseconds(row.original.updated_at)}, ${getTimeFromMilliseconds(row.original.updated_at)}`}</div>
        );
      },
      enableHiding: false,
    });
  }

  const eventPlanningColumns: ColumnDef<User>[] = [
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
      enableHiding: false,
    },
  ];

  const metadataColumns: ColumnDef<User>[] = [
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
      enableHiding: false,
    },
  ];

  const actionsColumn: ColumnDef<User>[] = [
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
      enableHiding: false,
    },
  ];

  return [
    ...identificationColumns,
    ...roleSpecificColumns,
    ...eventPlanningColumns,
    ...roleSpecificMetadataColumns,
    ...metadataColumns,
    ...actionsColumn,
  ];
};
