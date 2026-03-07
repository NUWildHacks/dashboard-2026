"use client";

import { SearchIcon } from "lucide-react";
import { useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { JudgeUser } from "@/types";

import { JudgingAssignment, Project } from "../../judging/types";

type JudgingAssignmentsTableProps = {
  judgingAssignments: JudgingAssignment[];
  projects: Project[];
  judges: JudgeUser[];
};

const JudgingAssignmentsTable = ({ judgingAssignments, projects, judges }: JudgingAssignmentsTableProps) => {
  const [selectedJudge, setSelectedJudge] = useState<JudgeUser | null>(null);
  const [search, setSearch] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadAssignments = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
      // Handle file upload logic here
    }
  };

  return (
    <div className="flex-1 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full flex flex-col md:flex-row gap-4">
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
          <Button onClick={handleUploadAssignments} className="w-full md:w-auto">
            Upload assignments
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Upload CSV file"
          />
        </div>
        <InputGroup className="md:max-w-[350px] min-w-[200px] w-full">
          <InputGroupInput
            id="search"
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
    </div>
  );
};

export default JudgingAssignmentsTable;
