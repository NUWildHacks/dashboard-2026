import { Clock, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import type { UseDialogReturn } from "@/hooks";
import { getEventTimeRange } from "@/lib";

import type { Event } from "../../types";

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
      <ItemContent className="gap-2 min-w-0">
        <ItemTitle className="w-full">
          <span className="truncate">{title}</span>
        </ItemTitle>
        <ItemDescription className="flex flex-row items-center gap-2">
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
      <ItemActions>
        <Badge variant="secondary">{category}</Badge>
      </ItemActions>
    </Item>
  );
};

export default EventItem;
