"use client";

import { Info, SearchIcon } from "lucide-react";
import Link from "next/link";

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
        <Alert className="shadow-xs bg-yellow-500/10 border-yellow-500 text-yellow-500">
          <Info />
          <AlertTitle className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-normal">
              Please read the{" "}
              <Link href="/guide/judging-and-awards/how-judging-works" className="underline underline-offset-4">
                judging guide
              </Link>{" "}
              before you start.
            </span>
          </AlertTitle>
        </Alert>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-2">
            <p className="text-sm">Your modality: </p>
            <Badge>{modality === "Other" ? other_modality : modality}</Badge>
          </div>
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
        <AssignedProjectGrid {...useJudgingFormSheetReturn} projectsWithMetadata={filteredProjectsWithMetadata} />
      </div>
      <JudgingFormSheet {...useJudgingFormSheetReturn} />
    </>
  );
};

export default JudgingDisplay;
