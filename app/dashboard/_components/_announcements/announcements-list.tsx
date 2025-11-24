import { MegaphoneOff } from "lucide-react";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Announcement } from "@/types/announcement";

import AnnouncementItem from "./announcement-item";

type AnnouncementsListProps = {
  announcements: Announcement[];
};

export default function AnnouncementsList({ announcements }: AnnouncementsListProps) {
  if (announcements.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MegaphoneOff />
          </EmptyMedia>
          <EmptyTitle>No announcements</EmptyTitle>
          <EmptyDescription>Keep an eye out for any updates!</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col justify-start items-center gap-4">
      {announcements.map((announcement) => (
        <AnnouncementItem key={announcement.id} {...announcement} />
      ))}
    </div>
  );
}
