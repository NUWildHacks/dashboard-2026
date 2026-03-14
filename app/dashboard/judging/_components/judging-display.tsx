"use client";

import { ExternalLinkIcon, SearchIcon } from "lucide-react";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JUDGING_GUIDE_PATH } from "@/constants";
import { CategoryWithAll, useFilters } from "@/hooks";
import { JudgeUser } from "@/types";

import { useJudgingFormSheet, useAssignedProjects } from "../_hooks";
import { TRACKS } from "../constants";
import type { ProjectWithMetadata, Track } from "../types";

import { AssignedProjectGrid, JudgingFormSheet } from ".";

type JudgingDisplayProps = {
  judgeId: JudgeUser["id"];
  projectsWithMetadata: ProjectWithMetadata[];
};

const JudgingDisplay = ({ judgeId, projectsWithMetadata }: JudgingDisplayProps) => {
  const { category, setCategory, search, setSearch } = useFilters<Track>();

  const { filteredProjectsWithMetadata } = useAssignedProjects(projectsWithMetadata, { category, search });

  const useJudgingFormSheetReturn = useJudgingFormSheet(judgeId);
  const { handleOpenJudgingForm } = useJudgingFormSheetReturn;

  return (
    <>
      <div className="h-full flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <Select value={category} onValueChange={(value) => setCategory(value as CategoryWithAll<Track>)}>
            <SelectTrigger className="min-w-[190px] lg:w-[190px] w-full">
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
        <Alert className="rounded-md border-green-600 bg-green-600/10 text-green-600 dark:border-green-400 dark:bg-green-400/10 dark:text-green-400">
          <ExternalLinkIcon />
          <AlertTitle>
            <a
              href={JUDGING_GUIDE_PATH}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:underline"
            >
              View the judging guide
            </a>
          </AlertTitle>
        </Alert>
        <AssignedProjectGrid
          handleOpenJudgingForm={handleOpenJudgingForm}
          projectsWithMetadata={filteredProjectsWithMetadata}
        />
      </div>
      <JudgingFormSheet {...useJudgingFormSheetReturn} />
    </>
  );
};

export default JudgingDisplay;
