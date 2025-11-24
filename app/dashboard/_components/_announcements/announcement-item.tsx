"use client";

import { Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { getSendTime } from "@/lib/time";
import { Announcement } from "@/types/announcement";

import { UseAnnouncementDialogReturn } from "../../_hooks/use-announcement-dialog";

type AnnouncementItemProps = Pick<UseAnnouncementDialogReturn, "handleSelectAnnouncement"> &
  Pick<Announcement, "id" | "category" | "title" | "author" | "created_at">;

export default function AnnouncementItem({
  handleSelectAnnouncement,
  id,
  category,
  title,
  author,
  created_at,
}: AnnouncementItemProps) {
  return (
    <Item
      variant="outline"
      onClick={() => handleSelectAnnouncement(id)}
      className="w-full transition-shadow hover:shadow-md hover:cursor-pointer"
    >
      <ItemContent className="gap-2">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <ItemTitle>{title}</ItemTitle>
          <Badge variant="secondary">{category}</Badge>
        </div>
        <ItemDescription className="flex flex-wrap items-center gap-4">
          <Badge variant="outline">{author}</Badge>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {getSendTime(created_at)}
          </span>
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}
