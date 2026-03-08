"use client";

import { Clock, MapPin } from "lucide-react";
import { memo } from "react";

import { Badge } from "@/components/ui/badge";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import type { UseItemDialogReturn } from "@/hooks";
import { cn, getEventTimeRange } from "@/lib";

import { ROW_HEIGHT } from "../../constants";
import type { Event } from "../../types";

type CalendarItemProps = Pick<Event, "id" | "category" | "title" | "start_time" | "end_time" | "location"> &
  Pick<UseItemDialogReturn<Event>, "handleSelectItem"> & {
    left: number;
    top: number;
    width: number;
    height: number;
    zIndex: number;
  };

const CalendarItem = ({
  id,
  category,
  title,
  start_time,
  end_time,
  location,
  handleSelectItem,
  left,
  top,
  width,
  height,
  zIndex,
}: CalendarItemProps) => {
  const isCompact = height < ROW_HEIGHT;

  return (
    <Item
      variant="outline"
      className={cn(
        "absolute px-3 shadow-xs bg-background transition-colors hover:bg-accent hover:cursor-pointer overflow-hidden",
        isCompact ? "items-center py-0" : "items-start py-2"
      )}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `calc(${width}% - 2px)`,
        height: `${height - 2}px`,
        zIndex,
      }}
      onClick={() => handleSelectItem(id)}
    >
      <ItemContent className={`gap-2 min-w-0 ${isCompact ? "flex-row justify-start items-center" : "flex-col"}`}>
        <ItemTitle className={`${isCompact ? "" : "w-full"}`}>
          <span className="truncate">{title}</span>
        </ItemTitle>
        <ItemDescription className="flex flex-row items-center gap-2">
          <Badge variant="secondary">{category}</Badge>
          <span className="flex items-center gap-1 text-xs font-medium text-nowrap">
            <Clock className="size-3 shrink-0" aria-hidden="true" />
            {getEventTimeRange(start_time, end_time)}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-nowrap">
            <MapPin className="size-3 shrink-0" aria-hidden="true" />
            {location}
          </span>
        </ItemDescription>
      </ItemContent>
    </Item>
  );
};

export default memo(CalendarItem);
