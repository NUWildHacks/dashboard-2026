"use client";

import { Clock } from "lucide-react";

import type { Event } from "@/app/dashboard/schedule/_types";
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
import { UseDialogReturn } from "@/hooks/use-dialog";
import { getTimeFromMinutes } from "@/lib/time";

type EventDialogProps = Pick<UseDialogReturn<Event>, "isOpen" | "setIsOpen" | "selectedItem">;

const EventDialog = ({ isOpen, setIsOpen, selectedItem }: EventDialogProps) => {
  if (!selectedItem) return null;

  const { category, title, body, start, end } = selectedItem;

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
                <span className="flex items-center gap-1 text-xs font-medium">
                  <Clock className="size-3" />
                  {getTimeFromMinutes(start)} - {getTimeFromMinutes(end)}
                </span>
              </div>
              <p className="text-center sm:text-left">{body}</p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
