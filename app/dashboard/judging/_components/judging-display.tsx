"use client";

import { Info, SearchIcon } from "lucide-react";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OTHER_MODALITY } from "@/constants";
import { CategoryWithAll, useFilters } from "@/hooks";
import type { JudgeUser } from "@/types";

import { useAssignedProjects, useJudgingFormSheet } from "../_hooks";
import { SUBMISSION_STATUSES } from "../constants";
import type { JudgingAssignmentWithProject, JudgingRound, SubmissionStatus } from "../types";

import { AssignedProjectList, JudgingFormSheet } from ".";

type JudgingDisplayProps = {
  judgingAssignmentsWithProject: JudgingAssignmentWithProject[];
  currentPath: string;
  judgingRound: JudgingRound;
} & Pick<JudgeUser, "id" | "modality" | "other_modality">;

const JudgingDisplay = ({
  judgingAssignmentsWithProject,
  currentPath,
  id: judgeId,
  modality,
  other_modality,
  judgingRound,
}: JudgingDisplayProps) => {
  const { category, setCategory, search, setSearch } = useFilters<CategoryWithAll<SubmissionStatus>>();

  const { filteredJudgingAssignmentsWithProject } = useAssignedProjects(judgingAssignmentsWithProject, {
    category,
    search,
  });

  const useJudgingFormSheetReturn = useJudgingFormSheet(judgeId, currentPath, judgingRound);

  return (
    <>
      <div className="h-full flex flex-col gap-4">
        <Alert className="shadow-xs">
          <Info />
          <AlertTitle className="flex items-center gap-2">
            <p className="text-sm">Your modality: </p>
            <Badge>{modality === OTHER_MODALITY ? other_modality : modality}</Badge>
          </AlertTitle>
          <AlertDescription>
            <span className="text-sm font-normal">
              Please familiarize yourself with the{" "}
              <Link href="/guide/judging-and-awards/how-judging-works" className="underline underline-offset-4">
                judging guide
              </Link>{" "}
              before you begin looking at projects.
            </span>
          </AlertDescription>
        </Alert>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <Select value={category} onValueChange={(value) => setCategory(value as CategoryWithAll<SubmissionStatus>)}>
            <SelectTrigger className="min-w-[150px] lg:w-[150px] w-full">
              <SelectValue placeholder="Select submission status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              {SUBMISSION_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
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
