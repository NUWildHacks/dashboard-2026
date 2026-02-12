"use client";

import { Clock, Loader2Icon } from "lucide-react";

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
import { getSendTime } from "@/lib";
import { User } from "@/types";

import { deleteAnnouncement } from "../_actions";
import { Announcement } from "../types";

type AnnouncementDialogProps = { userRole: User["role"] } & Pick<
  UseDialogReturn<Announcement>,
  "isOpen" | "setIsOpen" | "selectedItem" | "isDeleting" | "handleDeleteItem"
>;

const AnnouncementDialog = ({
  userRole,
  isOpen,
  setIsOpen,
  selectedItem,
  isDeleting,
  handleDeleteItem,
}: AnnouncementDialogProps) => {
  if (!selectedItem) return null;

  const { category, title, body, links, created_at } = selectedItem;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] lg:max-w-[800px]">
        <DialogHeader className="min-w-0">
          <DialogTitle asChild>
            <div className="flex justify-center sm:justify-start items-center gap-4 break-all">{title}</div>
          </DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-4 [&_strong]:text-foreground [&_strong]:font-semibold min-w-0">
              <div className="flex justify-center sm:justify-start items-center gap-x-4 gap-y-2">
                <Badge variant="secondary">{category}</Badge>
                <span className="flex items-center gap-1 text-xs font-medium">
                  <Clock className="size-3" aria-hidden="true" />
                  {getSendTime(created_at)}
                </span>
              </div>
              <p className="text-center sm:text-left break-all whitespace-pre-wrap">{body}</p>
              {links.length !== 0 && (
                <div className="space-y-2">
                  <strong>Attached Links</strong>
                  <ul className="space-y-1">
                    {links.map((link) => (
                      <li key={link}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block truncate hover:underline underline-offset-4"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {userRole === ADMIN && (
            <Button variant="destructive" onClick={() => handleDeleteItem(deleteAnnouncement)} disabled={isDeleting}>
              {isDeleting ? <Loader2Icon className="size-4 animate-spin" aria-hidden="true" /> : "Delete announcement"}
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

export default AnnouncementDialog;
