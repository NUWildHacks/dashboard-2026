"use client";

import { Badge } from "@/components/ui/badge";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";

import { ProjectWithMetadata } from "../types";

type AssignedProjectItemProps = {
  projectWithMetadata: ProjectWithMetadata;
};

const AssignedProjectItem = ({ projectWithMetadata }: AssignedProjectItemProps) => {
  const { name, track, judging_form } = projectWithMetadata;

  return (
    <Item variant="outline" aria-label={`Project: ${name}`} className="w-full shadow-xs">
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
    </Item>
  );
};

export default AssignedProjectItem;
