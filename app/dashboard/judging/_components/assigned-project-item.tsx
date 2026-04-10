"use client";

import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";

import { UseJudgingFormSheetReturn } from "../_hooks";
import type { JudgingAssignmentWithProject } from "../types";

type AssignedProjectItemProps = Pick<UseJudgingFormSheetReturn, "handleOpenJudgingForm" | "handleKeyDown"> & {
  judgingAssignmentWithProject: JudgingAssignmentWithProject;
};

const AssignedProjectItem = ({
  handleOpenJudgingForm,
  handleKeyDown,
  judgingAssignmentWithProject,
}: AssignedProjectItemProps) => {
  const { project, judging_form, room_id } = judgingAssignmentWithProject;
  const { name, track } = project;

  return (
    <Item
      variant="outline"
      tabIndex={0}
      aria-label={`Judge project: ${name}`}
      onClick={() => handleOpenJudgingForm(judgingAssignmentWithProject)}
      onKeyDown={(event) => handleKeyDown(event, judgingAssignmentWithProject)}
      className="w-full shadow-xs transition-colors hover:bg-secondary hover:cursor-pointer"
    >
      <ItemContent className="gap-2 min-w-0">
        <ItemTitle className="w-full">
          <span className="truncate">{name}</span>
        </ItemTitle>
        <ItemDescription className="flex flex-row items-center gap-2">
          <Badge variant="secondary">{track}</Badge>
          {judging_form && (
            <Badge
              variant="outline"
              className="border-none bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 focus-visible:outline-none dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 [a&]:hover:bg-green-600/5 dark:[a&]:hover:bg-green-400/5"
            >
              Submitted
            </Badge>
          )}
          <span className="flex items-center gap-1 text-xs font-medium text-nowrap">
            <MapPin className="size-3 shrink-0" aria-hidden="true" />
            {room_id}
          </span>
        </ItemDescription>
      </ItemContent>
    </Item>
  );
};

export default AssignedProjectItem;
