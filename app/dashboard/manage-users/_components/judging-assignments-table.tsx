"use client";

import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { DataTable } from "@/components/ui/data-table";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { JudgeUser } from "@/types";

import { useJudgingAssignmentsTable } from "../_hooks";
import { JudgingAssignment, ProjectWithMetadata } from "../../judging/types";

type JudgingAssignmentsTableProps = {
  projectsWithMetadata: ProjectWithMetadata[];
  judgingAssignments: JudgingAssignment[];
  judges: JudgeUser[];
};

const JudgingAssignmentsTable = ({
  projectsWithMetadata,
  judgingAssignments,
  judges,
}: JudgingAssignmentsTableProps) => {
  const {
    selectedJudge,
    setSelectedJudge,
    search,
    setSearch,
    table,
    projectsColumns,
    fileInputRef,
    handleUploadAssignments,
    handleFileChange,
  } = useJudgingAssignmentsTable(judgingAssignments, projectsWithMetadata);

  console.log(projectsWithMetadata);

  return (
    <div className="flex-1 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full flex flex-col md:flex-row gap-4">
          <Button onClick={handleUploadAssignments} className="w-full md:w-auto">
            Upload CSV
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload CSV file"
          />
          <Combobox
            items={judges}
            value={selectedJudge}
            onValueChange={setSelectedJudge}
            itemToStringLabel={(judge: JudgeUser) => `${judge.first_name} ${judge.last_name}`}
          >
            <ComboboxInput placeholder="Select a judge" className="w-full md:w-auto min-w-[200px]" />
            <ComboboxContent>
              <ComboboxEmpty>No judges found.</ComboboxEmpty>
              <ComboboxList>
                {(judge: JudgeUser) => (
                  <ComboboxItem key={judge.id} value={judge}>
                    {`${judge.first_name} ${judge.last_name}`}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
        <InputGroup className="md:max-w-[350px] min-w-[200px] w-full">
          <InputGroupInput
            id="search-projects"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="truncate"
            aria-label="Search projects"
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <DataTable columns={projectsColumns} table={table} />
      <div className="flex justify-between items-center">
        <div className="text-muted-foreground text-sm">{table.getFilteredRowModel().rows.length} row(s)</div>
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

export default JudgingAssignmentsTable;
