"use client";

import { Clock } from "lucide-react";
import Link from "next/link";

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
import { getSendTime } from "@/lib/time";

import { UseAnnouncementDialogReturn } from "../../_hooks/use-announcement-dialog";

type AnnouncementDialogProps = Pick<UseAnnouncementDialogReturn, "isOpen" | "setIsOpen" | "selectedAnnouncement">;

export default function AnnouncementDialog({ isOpen, setIsOpen, selectedAnnouncement }: AnnouncementDialogProps) {
  if (!selectedAnnouncement) return null;

  const { category, title, body, author, links, created_at } = selectedAnnouncement;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle asChild>
            <div className="flex justify-center sm:justify-start items-center gap-4">
              {title}
              <Badge variant="secondary">{category}</Badge>
            </div>
          </DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-4 [&_strong]:text-foreground [&_strong]:font-semibold">
              <div className="flex justify-center sm:justify-start items-center gap-x-4 gap-y-2">
                <Badge variant="outline">{author}</Badge>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {getSendTime(created_at)}
                </span>
              </div>
              <p className="text-center sm:text-left">{body}</p>
              {links.length !== 0 && (
                <div className="space-y-2">
                  <strong>Attached Links</strong>
                  <ul className="space-y-1">
                    {links.map((link) => (
                      <li key={link}>
                        <Link href={link} className="block hover:underline underline-offset-4">
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
}
