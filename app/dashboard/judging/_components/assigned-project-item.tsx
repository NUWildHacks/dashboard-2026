"use client";

import { Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";

import { UseJudgingFormSheetReturn } from "../_hooks";
import { ProjectWithMetadata } from "../types";

type AssignedProjectItemProps = Pick<UseJudgingFormSheetReturn, "handleOpenJudgingForm"> & {
  projectWithMetadata: ProjectWithMetadata;
};

const AssignedProjectItem = ({ handleOpenJudgingForm, projectWithMetadata }: AssignedProjectItemProps) => {
  const { name, track, judging_form } = projectWithMetadata;

  return (
    <Item variant="outline">
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
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => handleOpenJudgingForm(projectWithMetadata)}
          aria-label="Edit judging form"
        >
          <Pencil aria-hidden="true" />
        </Button>
      </ItemActions>
    </Item>
  );
};

export default AssignedProjectItem;
