"use client";

import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";

import { usePermissionCodesTable } from "../../_hooks";
import { PermissionCode } from "../../types";

import CreatePermissionCodeDialog from "./create-permission-code-dialog";

type PermissionCodesTableProps = {
  permissionCodes: PermissionCode[];
};

const PermissionCodesTable = ({ permissionCodes }: PermissionCodesTableProps) => {
  const { table, selectedPermissionCodeIds, handleDeletePermissionCodes, permissionCodesColumns } =
    usePermissionCodesTable(permissionCodes);

  return (
    <div className="flex-1 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full flex flex-col md:flex-row gap-4">
          <CreatePermissionCodeDialog />
          {selectedPermissionCodeIds.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => handleDeletePermissionCodes(selectedPermissionCodeIds)}
              className="w-full md:w-auto"
            >
              Delete permission code(s)
            </Button>
          )}
        </div>
        <InputGroup className="md:max-w-[350px] min-w-[200px] w-full">
          <InputGroupInput
            id="search"
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
            placeholder="Search emails..."
            className="truncate"
            aria-label="Search emails"
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <DataTable columns={permissionCodesColumns} table={table} />
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
  );
};

export default PermissionCodesTable;
