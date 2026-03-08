"use client";

import { SearchIcon } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryWithAll, useFilters } from "@/hooks";
import { JudgeUser } from "@/types";

import { useJudgingFormSheet, useAssignedProjects } from "../_hooks";
import { TRACKS } from "../constants";
import type { ProjectWithJudgingForm, Track } from "../types";

import { AssignedProjectGrid, JudgingFormSheet } from ".";

type JudgingDisplayProps = {
  judgeId: JudgeUser["id"];
  projectsWithJudgingForm: ProjectWithJudgingForm[];
};

const JudgingDisplay = ({ judgeId, projectsWithJudgingForm }: JudgingDisplayProps) => {
  const { category, setCategory, search, setSearch } = useFilters<Track>();

  const { filteredProjectsWithJudgingForm } = useAssignedProjects(projectsWithJudgingForm, { category, search });

  const useJudgingFormSheetReturn = useJudgingFormSheet(judgeId);
  const { handleOpenJudgingForm } = useJudgingFormSheetReturn;

  return (
    <>
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <Select value={category} onValueChange={(value) => setCategory(value as CategoryWithAll<Track>)}>
            <SelectTrigger className="min-w-[165px] lg:w-[165px] w-full">
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
        <AssignedProjectGrid
          handleOpenJudgingForm={handleOpenJudgingForm}
          projectsWithJudgingForm={filteredProjectsWithJudgingForm}
        />
      </div>
      <JudgingFormSheet {...useJudgingFormSheetReturn} />
    </>
  );
};

export default JudgingDisplay;
