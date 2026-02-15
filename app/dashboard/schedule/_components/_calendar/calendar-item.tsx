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

  const timeLocationContent = (
    <>
      <span className="flex items-center gap-1 text-xs font-medium text-nowrap">
        <Clock className="size-3 shrink-0" />
        {getEventTimeRange(start_time, end_time)}
      </span>
      <span className="flex items-center gap-1 text-xs font-medium text-nowrap">
        <MapPin className="size-3 shrink-0" />
        {location}
      </span>
    </>
  );

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
      <ItemContent className={cn("w-full", isCompact ? "flex-row items-center gap-2" : "flex-col gap-1")}>
        {isCompact ? (
          <>
            <ItemTitle className="text-nowrap">{title}</ItemTitle>
            <ItemDescription className="flex flex-row items-center gap-3">{timeLocationContent}</ItemDescription>
            <Badge variant="secondary" className="text-nowrap shrink-0 ml-auto">
              {category}
            </Badge>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2 w-full">
              <ItemTitle className="text-nowrap">{title}</ItemTitle>
              <Badge variant="secondary" className="text-nowrap shrink-0">
                {category}
              </Badge>
            </div>
            <ItemDescription className="flex flex-row items-start gap-3">{timeLocationContent}</ItemDescription>
          </>
        )}
      </ItemContent>
    </Item>
  );
};

export default memo(CalendarItem);
