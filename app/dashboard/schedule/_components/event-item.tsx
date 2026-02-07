import { Clock, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import type { UseDialogReturn } from "@/hooks";
import { getEventTimeRange } from "@/lib";

import type { Event } from "../types";

type EventItemProps = Pick<UseDialogReturn<Event>, "handleSelectItem" | "handleKeyDown"> &
  Pick<Event, "id" | "category" | "title" | "start_time" | "end_time" | "location">;

const EventItem = ({
  handleSelectItem,
  handleKeyDown,
  id,
  category,
  title,
  start_time,
  end_time,
  location,
}: EventItemProps) => {
  return (
    <Item
      variant="outline"
      onClick={() => handleSelectItem(id)}
      onKeyDown={(event) => handleKeyDown(event, id)}
      tabIndex={0}
      role="button"
      aria-label={`View event: ${title}`}
      className="w-full shadow-xs transition-colors hover:bg-accent hover:cursor-pointer"
    >
      <ItemContent className="gap-2">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <ItemTitle>{title}</ItemTitle>
          <Badge variant="secondary">{category}</Badge>
        </div>
        <ItemDescription className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-medium">
            <Clock className="size-3" aria-hidden="true" />
            {getEventTimeRange(start_time, end_time)}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium">
            <MapPin className="size-3" aria-hidden="true" />
            {location}
          </span>
        </ItemDescription>
      </ItemContent>
    </Item>
  );
};

export default EventItem;
