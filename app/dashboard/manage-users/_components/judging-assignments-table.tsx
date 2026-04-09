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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryWithAll } from "@/hooks";
import { JudgeAndMentorUser, JudgeUser } from "@/types";

import { useJudgingAssignmentsTable } from "../_hooks";
import type { JudgingAssignment, Project } from "../../judging/types";

type JudgingAssignmentsTableProps = {
  judgingAssignments: JudgingAssignment[];
  projects: Project[];
  judges: (JudgeUser | JudgeAndMentorUser)[];
};

const JudgingAssignmentsTable = ({ judgingAssignments, projects, judges }: JudgingAssignmentsTableProps) => {
  const {
    selectedJudge,
    setSelectedJudge,
    search,
    setSearch,
    round,
    setRound,
    table,
    judgingAssignmentsColumns,
    fileInputRef,
    handleUploadAssignments,
    handleFileChange,
  } = useJudgingAssignmentsTable(judgingAssignments, projects);

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
          <Select value={round} onValueChange={(value) => setRound(value as CategoryWithAll<"round-1" | "round-2">)}>
            <SelectTrigger
              id="round-filter"
              className="min-w-[125px] md:w-[125px] w-full"
              aria-label="Filter users by round"
            >
              <SelectValue placeholder="Select round" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="round-1">Round 1</SelectItem>
              <SelectItem value="round-2">Round 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <InputGroup className="md:max-w-[350px] min-w-[200px] w-full">
          <InputGroupInput
            id="search-judging-assignments"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search judging assignments..."
            className="truncate"
            aria-label="Search judging assignments"
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <DataTable columns={judgingAssignmentsColumns} table={table} />
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
