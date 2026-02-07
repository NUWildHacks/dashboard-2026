"use client";

import { Clock, Loader2Icon, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ADMIN } from "@/constants";
import type { UseDialogReturn } from "@/hooks";
import { getEventTimeRange } from "@/lib";
import { User } from "@/types";

import { deleteEvent } from "../_actions";
import type { Event } from "../types";

type EventDialogProps = { userRole: User["role"] } & Pick<
  UseDialogReturn<Event>,
  "isOpen" | "setIsOpen" | "selectedItem" | "isDeleting" | "handleDeleteItem"
>;

const EventDialog = ({ userRole, isOpen, setIsOpen, selectedItem, isDeleting, handleDeleteItem }: EventDialogProps) => {
  if (!selectedItem) return null;

  const { category, title, body, location, start_time, end_time } = selectedItem;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle asChild>
            <div className="flex justify-center sm:justify-start items-center gap-4">{title}</div>
          </DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-4 [&_strong]:text-foreground [&_strong]:font-semibold">
              <div className="flex justify-center sm:justify-start items-center gap-x-4 gap-y-2">
                <Badge variant="secondary">{category}</Badge>
                <span className="flex items-center gap-1 text-xs font-medium text-nowrap">
                  <Clock className="size-3" />
                  {getEventTimeRange(start_time, end_time)}
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-nowrap">
                  <MapPin className="size-3" />
                  {location}
                </span>
              </div>
              <p className="text-center sm:text-left">{body}</p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {userRole === ADMIN && (
            <Button variant="destructive" onClick={() => handleDeleteItem(deleteEvent)} disabled={isDeleting}>
              {isDeleting ? <Loader2Icon className="size-4 animate-spin" /> : "Delete event"}
            </Button>
          )}
          <DialogClose asChild>
            <Button variant="outline" disabled={isDeleting}>
              Go back
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
