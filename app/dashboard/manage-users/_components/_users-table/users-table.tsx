"use client";

import { ChevronDownIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JUDGE, MENTOR, PARTICIPANT, ROLES } from "@/constants";
import { useConfirmDeleteDialog } from "@/hooks";
import { User } from "@/types";

import { ConfirmDeleteUsersDialog } from "..";
import { deleteUsers } from "../../_actions";
import { useUsersTable } from "../../_hooks";

type UsersTableProps = {
  userId: User["id"];
  users: User[];
};

const UsersTable = ({ userId, users }: UsersTableProps) => {
  const useConfirmDeleteDialogReturn = useConfirmDeleteDialog<User>(deleteUsers, "users");
  const { handleOpenConfirmDeleteDialog } = useConfirmDeleteDialogReturn;

  const { role, setRole, search, setSearch, table, selectedUserIds, usersColumns, handleDownloadCSV } = useUsersTable(
    users,
    handleOpenConfirmDeleteDialog
  );

  return (
    <>
      <div className="flex-1 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full flex flex-col md:flex-row gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={role} onValueChange={(value) => setRole(value as User["role"])}>
                <SelectTrigger
                  id="role-filter"
                  className="min-w-[125px] md:w-[125px] w-full"
                  aria-label="Filter users by role"
                >
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(role === PARTICIPANT || role === JUDGE || role === MENTOR) && (
                <Button className="w-full md:w-auto" onClick={handleDownloadCSV}>
                  Download CSV
                </Button>
              )}
            </div>
            {selectedUserIds.length > 0 && (
              <Button
                variant="destructive"
                onClick={() => handleOpenConfirmDeleteDialog(selectedUserIds)}
                className="w-full md:w-auto"
              >
                Delete user(s)
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Show/hide columns
                  <ChevronDownIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.columnDef.header?.toString()}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <InputGroup className="md:max-w-[350px] min-w-[200px] w-full">
            <InputGroupInput
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="truncate"
              aria-label="Search users"
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <DataTable columns={usersColumns} table={table} />
        <div className="flex justify-between items-center">
          <div className="text-muted-foreground text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
            selected.
          </div>
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      </div>
      <ConfirmDeleteUsersDialog userId={userId} {...useConfirmDeleteDialogReturn} />
    </>
  );
};

export default UsersTable;
