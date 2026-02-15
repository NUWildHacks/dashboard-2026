import { ColumnDef, Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

import { Announcement } from "../types";

type AnnouncementsTableProps = {
  columns: ColumnDef<Announcement>[];
  table: Table<Announcement>;
};

const AnnouncementsTable = ({ columns, table }: AnnouncementsTableProps) => {
  return (
    <>
      <DataTable columns={columns} table={table} />
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
    </>
  );
};

export default AnnouncementsTable;
