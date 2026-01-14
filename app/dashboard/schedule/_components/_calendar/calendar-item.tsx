"use client";

import { Clock } from "lucide-react";
import { memo } from "react";

import { ROW_HEIGHT } from "@/app/dashboard/schedule/_constants/calendar.constants";
import type { Event } from "@/app/dashboard/schedule/_types";
import { Badge } from "@/components/ui/badge";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { UseDialogReturn } from "@/hooks/use-dialog";
import { getEventTimeRange } from "@/lib/time.lib";
import { cn } from "@/lib/utils.lib";

type CalendarItemProps = Pick<Event, "id" | "category" | "title" | "start_time" | "end_time"> &
  Pick<UseDialogReturn<Event>, "handleSelectItem"> & {
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
      className="absolute items-start px-3 py-2 shadow-xs bg-background transition-colors hover:bg-accent hover:cursor-pointer overflow-hidden"
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
            <ItemTitle className="text-nowrap shrink-0">{title}</ItemTitle>
            <ItemDescription className="flex flex-nowrap items-center gap-1 shrink-0">
              <Clock className="size-3 shrink-0" />
              <span className="text-xs text-nowrap font-medium">{getEventTimeRange(start_time, end_time)}</span>
            </ItemDescription>
            <Badge variant="secondary" className="text-nowrap shrink-0 ml-auto">
              {category}
            </Badge>
          </>
        ) : (
          <>
            <div className="flex flex-row items-center justify-between gap-2 w-full">
              <ItemTitle className="text-nowrap">{title}</ItemTitle>
              <Badge variant="secondary" className="text-nowrap shrink-0">
                {category}
              </Badge>
            </div>
            <ItemDescription className="flex flex-nowrap items-center gap-1">
              <Clock className="size-3 shrink-0" />
              <span className="text-xs text-nowrap font-medium">{getEventTimeRange(start_time, end_time)}</span>
            </ItemDescription>
          </>
        )}
      </ItemContent>
    </Item>
  );
};

export default memo(CalendarItem);
