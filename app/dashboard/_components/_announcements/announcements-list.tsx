import { MegaphoneOff } from "lucide-react";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import Announcement from "@/types/announcement";

import { UseAnnouncementDialogReturn } from "../../_hooks/use-announcement-dialog";

import AnnouncementItem from "./announcement-item";

type AnnouncementsListProps = {
  announcements: Announcement[];
  isLoading: boolean;
} & Pick<UseAnnouncementDialogReturn, "handleSelectAnnouncement">;

export default function AnnouncementsList({
  announcements,
  isLoading,
  handleSelectAnnouncement,
}: AnnouncementsListProps) {
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

  if (isLoading) {
    return <></>;
  }

  return announcements.map((announcement) => (
    <AnnouncementItem key={announcement.id} handleSelectAnnouncement={handleSelectAnnouncement} {...announcement} />
  ));
}
