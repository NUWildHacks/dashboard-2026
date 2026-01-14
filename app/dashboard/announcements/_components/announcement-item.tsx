"use client";

import { Clock } from "lucide-react";

import type { Announcement } from "@/app/dashboard/announcements/_types";
import { Badge } from "@/components/ui/badge";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { UseDialogReturn } from "@/hooks/use-dialog";
import { getSendTime } from "@/lib/time.lib";

type AnnouncementItemProps = Pick<UseDialogReturn<Announcement>, "handleSelectItem"> &
  Pick<Announcement, "id" | "category" | "title" | "created_at">;

const AnnouncementItem = ({ handleSelectItem, id, category, title, created_at }: AnnouncementItemProps) => {
  return (
    <Item
      variant="outline"
      onClick={() => handleSelectItem(id)}
      className="w-full shadow-xs transition-colors hover:bg-accent hover:cursor-pointer"
    >
      <ItemContent className="gap-2">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <ItemTitle>{title}</ItemTitle>
          <Badge variant="secondary">{category}</Badge>
        </div>
        <ItemDescription>
          <span className="flex items-center gap-1 text-xs font-medium">
            <Clock className="size-3" />
            {getSendTime(created_at)}
          </span>
        </ItemDescription>
      </ItemContent>
    </Item>
  );
};

export default AnnouncementItem;
