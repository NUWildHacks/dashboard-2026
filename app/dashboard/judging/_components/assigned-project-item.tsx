import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";

import { Project } from "../types";

type AssignedProjectItemProps = Pick<Project, "id" | "name" | "track" | "project_url">;

const AssignedProjectItem = ({ id, name, track, project_url }: AssignedProjectItemProps) => {
  return (
<Item
      variant="outline"
      // onClick={() => handleSelectItem(id)}
      // onKeyDown={(event) => handleKeyDown(event, id)}
      tabIndex={0}
      role="button"
      aria-label={`View event: ${name}`}
      className="w-full shadow-xs transition-colors hover:bg-accent hover:cursor-pointer"
    >
      <ItemContent className="gap-2 min-w-0">
        <ItemTitle className="w-full">
          <span className="truncate">{name}</span>
        </ItemTitle>
        <ItemDescription className="flex flex-row items-center gap-2">
          <a href={project_url} target="_blank" rel="noreferrer">
            View project <ExternalLink />
          </a>
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Badge variant="secondary">{track}</Badge>
      </ItemActions>
    </Item>
  );
};

export default AssignedProjectItem;
