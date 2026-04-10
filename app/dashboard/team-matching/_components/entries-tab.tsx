"use client";

import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import { useEntriesTable } from "../_hooks/use-entries-table";
import type { IntakeEntry } from "../_lib/lib";

export function EntriesTab({ entries }: { entries: IntakeEntry[] }) {
  const { search, setSearch, table, columns } = useEntriesTable(entries);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {entries.length} submission{entries.length !== 1 ? "s" : ""}
        </p>
        <InputGroup className="max-w-xs">
          <InputGroupInput
            placeholder="Search entries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon className="size-4" />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <DataTable columns={columns} table={table} />
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
}
