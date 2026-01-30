"use client";

import { Clock, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
  "isOpen" | "setIsOpen" | "selectedItem"
>;

const EventDialog = ({ userRole, isOpen, setIsOpen, selectedItem }: EventDialogProps) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  if (!selectedItem) return null;

  const { id, category, title, body, start_time, end_time } = selectedItem;

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteEvent(id);
      const { success } = result;

      if (!success) {
        const { error } = result;
        throw new Error(error);
      }

      setIsOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Error deleting event:", errorMessage);

      toast.error("Failed to delete event", { description: errorMessage });
    } finally {
      setIsDeleting(false);
    }
  };

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
                  {getEventTimeRange(start_time, end_time)}
                </span>
              </div>
              <p className="text-center sm:text-left">{body}</p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {userRole === ADMIN && (
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
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
