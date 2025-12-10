"use client";

import { Clock } from "lucide-react";
import { memo } from "react";

import { Badge } from "@/components/ui/badge";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { ROW_HEIGHT } from "@/constants/calendar";
import { getTimeFromMinutes } from "@/lib/time";
import { cn } from "@/lib/utils";
import { CalendarItemLayout } from "@/types/calendar";

import { UseEventDialogReturn } from "../../_hooks/use-event-dialog";

type CalendarItemProps = CalendarItemLayout & Pick<UseEventDialogReturn, "handleSelectEvent">;

const CalendarItem = ({ event, left, top, width, height, zIndex, handleSelectEvent }: CalendarItemProps) => {
  const { id, category, title, start, end } = event;

  const isCompact = height < ROW_HEIGHT;

  return (
    <Item
      variant="outline"
      className="absolute items-start px-3 py-2 bg-background transition-shadow hover:shadow-md hover:cursor-pointer overflow-hidden"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `calc(${width}% - 2px)`,
        height: `${height - 2}px`,
        zIndex,
      }}
      onClick={() => handleSelectEvent(id)}
    >
      <ItemContent className={cn("w-full", isCompact ? "flex-row items-center gap-2" : "flex-col gap-1")}>
        {isCompact ? (
          <>
            <ItemTitle className="text-nowrap shrink-0">{title}</ItemTitle>
            <ItemDescription className="flex flex-nowrap items-center gap-1 shrink-0">
              <Clock className="size-3 shrink-0" />
              <span className="text-xs text-nowrap font-medium">
                {getTimeFromMinutes(start)} - {getTimeFromMinutes(end)}
              </span>
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
              <span className="text-xs text-nowrap font-medium">
                {getTimeFromMinutes(start)} - {getTimeFromMinutes(end)}
              </span>
            </ItemDescription>
          </>
        )}
      </ItemContent>
    </Item>
  );
};

export default memo(CalendarItem);
