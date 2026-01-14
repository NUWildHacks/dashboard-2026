import { Clock } from "lucide-react";

import type { Event } from "@/app/dashboard/schedule/_types";
import { Badge } from "@/components/ui/badge";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { UseDialogReturn } from "@/hooks/use-dialog";
import { getEventTimeRange } from "@/lib/time.lib";

type EventItemProps = Pick<UseDialogReturn<Event>, "handleSelectItem"> &
  Pick<Event, "id" | "category" | "title" | "start_time" | "end_time">;

const EventItem = ({ handleSelectItem, id, category, title, start_time, end_time }: EventItemProps) => {
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
        <ItemDescription className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1 text-xs font-medium">
            <Clock className="size-3" />
            {getEventTimeRange(start_time, end_time)}
          </span>
        </ItemDescription>
      </ItemContent>
    </Item>
  );
};

export default EventItem;
