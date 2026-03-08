"use client";

import { ExternalLink, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { UseItemDialogReturn } from "@/hooks";

import { Project } from "../types";

type AssignedProjectItemProps = Pick<UseItemDialogReturn<Project>, "handleSelectItem" | "handleKeyDown"> &
  Pick<Project, "id" | "name" | "track" | "project_url">;

const AssignedProjectItem = ({
  handleSelectItem,
  handleKeyDown,
  id,
  name,
  track,
  project_url,
}: AssignedProjectItemProps) => {
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
          onClick={() => handleSelectItem(id)}
          onKeyDown={(event) => handleKeyDown(event, id)}
          tabIndex={0}
          aria-label="Edit judging form"
        >
          <Pencil aria-hidden="true" />
        </Button>
      </ItemActions>
    </Item>
  );
};

export default AssignedProjectItem;
