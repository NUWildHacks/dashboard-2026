"use client";

import { Info, SearchIcon } from "lucide-react";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useFilters } from "@/hooks";
import type { JudgeUser } from "@/types";

import { useAssignedProjects, useJudgingFormSheet } from "../_hooks";
import type { JudgingAssignmentWithProject, Track } from "../types";

import { AssignedProjectList, JudgingFormSheet } from ".";

type JudgingDisplayProps = {
  judgingAssignmentsWithProject: JudgingAssignmentWithProject[];
  currentPath: string;
} & Pick<JudgeUser, "id" | "modality" | "other_modality">;

const JudgingDisplay = ({
  judgingAssignmentsWithProject,
  currentPath,
  id: judgeId,
  modality,
  other_modality,
}: JudgingDisplayProps) => {
  const { search, setSearch } = useFilters<Track>();

  const { filteredJudgingAssignmentsWithProject } = useAssignedProjects(judgingAssignmentsWithProject, { search });

  const useJudgingFormSheetReturn = useJudgingFormSheet(judgeId, currentPath);

  return (
    <>
      <div className="h-full flex flex-col gap-4">
        <Alert className="shadow-xs">
          <Info />
          <AlertTitle className="flex flex-wrap items-center gap-2">Important reminder</AlertTitle>
          <AlertDescription>
            <span className="text-sm font-normal">
              You should be familiar with the{" "}
              <Link href="/guide/judging-and-awards/how-judging-works" className="underline underline-offset-4">
                judging guide
              </Link>{" "}
              before you begin looking at projects.
            </span>
          </AlertDescription>
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
        <AssignedProjectList
          {...useJudgingFormSheetReturn}
          judgingAssignmentsWithProjects={filteredJudgingAssignmentsWithProject}
        />
      </div>
      <JudgingFormSheet {...useJudgingFormSheetReturn} />
    </>
  );
};

export default JudgingDisplay;
