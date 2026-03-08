"use client";

import { Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";

import { UseJudgingFormSheetReturn } from "../_hooks";
import { ProjectWithJudgingForm } from "../types";

type AssignedProjectItemProps = Pick<UseJudgingFormSheetReturn, "handleOpenJudgingForm"> & {
  projectWithJudgingForm: ProjectWithJudgingForm;
};

const AssignedProjectItem = ({ handleOpenJudgingForm, projectWithJudgingForm }: AssignedProjectItemProps) => {
  const { name, track } = projectWithJudgingForm;

  return (
    <Item variant="outline">
      <ItemContent className="gap-2 min-w-0">
        <ItemTitle className="w-full">
          <span className="truncate">{name}</span>
        </ItemTitle>
        <ItemDescription className="flex flex-row items-center gap-2">
          <Badge variant="secondary">{track}</Badge>
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => handleOpenJudgingForm(projectWithJudgingForm)}
          aria-label="Edit judging form"
        >
          <Pencil aria-hidden="true" />
        </Button>
      </ItemActions>
    </Item>
  );
};

export default AssignedProjectItem;
