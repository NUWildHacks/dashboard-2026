"use client";

import { SearchIcon } from "lucide-react";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useFilters } from "@/hooks";
import type { JudgeUser } from "@/types";

import { useAssignedProjects, useJudgingFormSheet } from "../_hooks";
import type { ProjectWithMetadata, Track } from "../types";

import { AssignedProjectGrid, JudgingFormSheet } from ".";

type JudgingDisplayProps = {
  projectsWithMetadata: ProjectWithMetadata[];
  currentPath: string;
} & Pick<JudgeUser, "id" | "modality" | "other_modality">;

const JudgingDisplay = ({
  projectsWithMetadata,
  currentPath,
  id: judgeId,
  modality,
  other_modality,
}: JudgingDisplayProps) => {
  const { search, setSearch } = useFilters<Track>();

  const { filteredProjectsWithMetadata } = useAssignedProjects(projectsWithMetadata, { search });

  const useJudgingFormSheetReturn = useJudgingFormSheet(judgeId, currentPath);

  return (
    <>
      <div className="h-full flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
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
        <Alert className="rounded-md border-yellow-600 bg-yellow-600/10 text-yellow-600 dark:border-yellow-400 dark:bg-yellow-400/10 dark:text-yellow-400">
          <AlertTitle className="flex flex-wrap items-center gap-2">
            <span>
              Your modality:{" "}
              <Badge className="border-yellow-600/40 bg-yellow-600/20 text-yellow-700 dark:border-yellow-400/40 dark:bg-yellow-400/20 dark:text-yellow-300">
                {modality === "Other" ? other_modality : modality}
              </Badge>
            </span>
            <span className="font-normal">
              &mdash; Read the{" "}
              <a href="/guide/judging-and-awards/how-judging-works" className="underline underline-offset-4">
                judging guide
              </a>{" "}
              before you start.
            </span>
          </AlertTitle>
        </Alert>
        <AssignedProjectGrid {...useJudgingFormSheetReturn} projectsWithMetadata={filteredProjectsWithMetadata} />
      </div>
      <JudgingFormSheet {...useJudgingFormSheetReturn} />
    </>
  );
};

export default JudgingDisplay;
