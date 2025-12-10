import { MegaphoneOff } from "lucide-react";

import Announcement from "@/app/dashboard/_types/announcement.type";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";

import { UseDialogReturn } from "../../_hooks/use-dialog";

import AnnouncementItem from "./announcement-item";

type AnnouncementsListProps = {
  announcements: Announcement[];
  isLoading: boolean;
} & Pick<UseDialogReturn<Announcement>, "handleSelectItem">;

const AnnouncementsList = ({ announcements, isLoading, handleSelectItem }: AnnouncementsListProps) => {
  if (isLoading) {
    return (
      <>
        <Skeleton className="h-[115px] md:h-[86px] w-full" />
        <Skeleton className="h-[115px] md:h-[86px] w-full" />
        <Skeleton className="h-[115px] md:h-[86px] w-full" />
      </>
    );
  }

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

  return announcements.map((announcement) => (
    <AnnouncementItem key={announcement.id} handleSelectItem={handleSelectItem} {...announcement} />
  ));
};

export default AnnouncementsList;
