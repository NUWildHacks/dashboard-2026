import { Clock } from "lucide-react";

import Event from "@/app/dashboard/_types/event.type";
import { Badge } from "@/components/ui/badge";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { getTimeFromMinutes } from "@/lib/time";

import { UseDialogReturn } from "../../_hooks/use-dialog";

type EventItemProps = Pick<UseDialogReturn<Event>, "handleSelectItem"> &
  Pick<Event, "id" | "category" | "title" | "start" | "end">;

const EventItem = ({ handleSelectItem, id, category, title, start, end }: EventItemProps) => {
  return (
    <Item
      variant="outline"
      onClick={() => handleSelectItem(id)}
      className="w-full transition-shadow hover:shadow-md hover:cursor-pointer"
    >
      <ItemContent className="gap-2">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <ItemTitle>{title}</ItemTitle>
          <Badge variant="secondary">{category}</Badge>
        </div>
        <ItemDescription className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1 text-xs font-medium">
            <Clock className="size-3" />
            {getTimeFromMinutes(start)} - {getTimeFromMinutes(end)}
          </span>
        </ItemDescription>
      </ItemContent>
    </Item>
  );
};

export default EventItem;
