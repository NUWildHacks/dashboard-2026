"use client";

import { SearchIcon } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryWithAll, useFilters } from "@/hooks";
import { JudgeUser } from "@/types";

import { useJudgingFormSheet } from "../_hooks";
import { useAssignedProjects } from "../_hooks/use-assigned-projects";
import { TRACKS } from "../constants";
import type { ProjectWithJudgingForm, Track } from "../types";

import { AssignedProjectItem, JudgingFormSheet } from ".";

type AssignedProjectsDisplayProps = {
  judgeId: JudgeUser["id"];
  projectsWithJudgingForm: ProjectWithJudgingForm[];
};

const AssignedProjectsDisplay = ({ judgeId, projectsWithJudgingForm }: AssignedProjectsDisplayProps) => {
  const { category, setCategory, search, setSearch } = useFilters<Track>();

  const { filteredProjectsWithJudgingForm } = useAssignedProjects(projectsWithJudgingForm, { category, search });

  const useJudgingFormSheetReturn = useJudgingFormSheet(judgeId);

  return (
    <>
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <Select value={category} onValueChange={(value) => setCategory(value as CategoryWithAll<Track>)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select track" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                {TRACKS.map((track) => (
                  <SelectItem key={track} value={track}>
                    {track}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <InputGroup className="lg:max-w-[350px] w-full">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredProjectsWithJudgingForm.map((projectWithJudgingForm) => (
            <AssignedProjectItem
              key={projectWithJudgingForm.id}
              {...useJudgingFormSheetReturn}
              projectWithJudgingForm={projectWithJudgingForm}
            />
          ))}
        </div>
      </div>
      <JudgingFormSheet {...useJudgingFormSheetReturn} />
    </>
  );
};

export default AssignedProjectsDisplay;
