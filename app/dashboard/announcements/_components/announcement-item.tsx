"use client";

import { Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import type { UseDialogReturn } from "@/hooks";
import { getSendTime } from "@/lib";

import type { Announcement } from "../types";

type AnnouncementItemProps = Pick<UseDialogReturn<Announcement>, "handleSelectItem" | "handleKeyDown"> &
  Pick<Announcement, "id" | "category" | "title" | "created_at">;

const AnnouncementItem = ({
  handleSelectItem,
  handleKeyDown,
  id,
  category,
  title,
  created_at,
}: AnnouncementItemProps) => {
  return (
    <Item
      variant="outline"
      onClick={() => handleSelectItem(id)}
      onKeyDown={(event) => handleKeyDown(event, id)}
      tabIndex={0}
      role="button"
      aria-label={`View announcement: ${title}`}
      className="w-full shadow-xs transition-colors hover:bg-accent hover:cursor-pointer"
    >
      <ItemContent className="gap-2 min-w-0">
        <ItemTitle className="w-full">
          <span className="truncate">{title}</span>
        </ItemTitle>
        <ItemDescription>
          <span className="flex items-center gap-1 text-xs font-medium text-nowrap">
            <Clock className="size-3" aria-hidden="true" />
            {getSendTime(created_at)}
          </span>
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Badge variant="secondary">{category}</Badge>
      </ItemActions>
    </Item>
  );
};

export default AnnouncementItem;
