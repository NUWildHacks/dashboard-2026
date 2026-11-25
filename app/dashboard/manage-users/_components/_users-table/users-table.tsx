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
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  JUDGE,
  JUDGE_AND_MENTOR,
  PARTICIPANT,
  WAITLISTED,
  ROLES,
} from "@/constants";
import { useConfirmDeleteDialog } from "@/hooks";
import { User } from "@/types";

import {
  ConfirmDeleteUsersDialog,
  ConfirmPromoteUsersDialog,
} from "..";
import { deleteUsers } from "../../_actions";
import {
  usePromoteUsersDialog,
  useUsersTable,
} from "../../_hooks";

type UsersTableProps = {
  userId: User["id"];
  users: User[];
  /** Participant rows now, for the promote dialog's limit warning. */
  participantCount: number;
  maxParticipants: number;
};

const UsersTable = ({
  userId,
  users,
  participantCount,
  maxParticipants,
}: UsersTableProps) => {
  const useConfirmDeleteDialogReturn =
    useConfirmDeleteDialog<User>(deleteUsers, "users");
  const { handleOpenConfirmDeleteDialog } =
    useConfirmDeleteDialogReturn;

  const {
    role,
    setRole,
    search,
    setSearch,
    table,
    selectedUsers,
    selectedUserIds,
    usersColumns,
    handleDownloadCSV,
  } = useUsersTable(users, handleOpenConfirmDeleteDialog);

  // Unselect only the promoted users, so other selected users stay selected.
  const usePromoteUsersDialogReturn = usePromoteUsersDialog(
    (promotedIds) =>
      table.setRowSelection((selection) => {
        const next = { ...selection };
        promotedIds.forEach((id) => delete next[id]);
        return next;
      })
  );
  const { handleOpenPromoteDialog } =
    usePromoteUsersDialogReturn;

  // Promote uses every selected waitlisted user, including users that the search hides.
  const selectedWaitlistedIds = selectedUsers
    .filter((user) => user.role === WAITLISTED)
    .map((user) => user.id);

  return (
    <>
      <div className="flex-1 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full flex flex-col md:flex-row gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Select
                value={role}
                onValueChange={(value) =>
                  setRole(value as User["role"])
                }
              >
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
              {(role === PARTICIPANT ||
                role === WAITLISTED ||
                role === JUDGE ||
                role === JUDGE_AND_MENTOR) && (
                <Button
                  className="w-full md:w-auto"
                  onClick={handleDownloadCSV}
                >
                  Download CSV
                </Button>
              )}
            </div>
            {role === WAITLISTED &&
              selectedWaitlistedIds.length > 0 && (
                <Button
                  onClick={() =>
                    handleOpenPromoteDialog(
                      selectedWaitlistedIds
                    )
                  }
                  className="w-full md:w-auto"
                >
                  Promote {selectedWaitlistedIds.length}{" "}
                  user(s)
                </Button>
              )}
            {selectedUserIds.length > 0 && (
              <Button
                variant="destructive"
                onClick={() =>
                  handleOpenConfirmDeleteDialog(
                    selectedUserIds
                  )
                }
                className="w-full md:w-auto"
              >
                Delete {selectedUserIds.length} user(s)
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
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
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
            {selectedUserIds.length} user(s) selected in
            total (
            {
              table.getFilteredSelectedRowModel().rows
                .length
            }{" "}
            of {table.getFilteredRowModel().rows.length} in
            this list).
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      <ConfirmDeleteUsersDialog
        userId={userId}
        users={users}
        {...useConfirmDeleteDialogReturn}
      />
      <ConfirmPromoteUsersDialog
        users={users}
        participantCount={participantCount}
        maxParticipants={maxParticipants}
        {...usePromoteUsersDialogReturn}
      />
    </>
  );
};

export default UsersTable;
