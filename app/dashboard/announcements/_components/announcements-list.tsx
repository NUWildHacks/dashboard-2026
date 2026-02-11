import { MegaphoneOff } from "lucide-react";

import { AnnouncementItem } from "@/app/dashboard/announcements/_components";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import type { UseDialogReturn } from "@/hooks";

import type { Announcement } from "../types";

type AnnouncementsListProps = {
  announcements: Announcement[];
  isLoading: boolean;
} & Pick<UseDialogReturn<Announcement>, "handleSelectItem" | "handleKeyDown">;

const AnnouncementsList = ({ announcements, isLoading, handleSelectItem, handleKeyDown }: AnnouncementsListProps) => {
  if (isLoading) {
    return (
      <>
        <span className="sr-only">Loading announcements, please wait</span>
        <Skeleton className="h-[80px] w-full" aria-hidden="true" />
        <Skeleton className="h-[80px] w-full" aria-hidden="true" />
        <Skeleton className="h-[80px] w-full" aria-hidden="true" />
      </>
    );
  }

  if (announcements.length === 0) {
    return (
      <Empty role="status" aria-live="polite">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MegaphoneOff aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No announcements found</EmptyTitle>
          <EmptyDescription>More announcements will be made in the future. Check back soon!</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ul className="flex flex-col gap-4 w-full min-h-[250px]" aria-label="Announcements list">
      {announcements.map((announcement) => (
        <li key={announcement.id}>
          <AnnouncementItem handleSelectItem={handleSelectItem} handleKeyDown={handleKeyDown} {...announcement} />
        </li>
      ))}
    </ul>
  );
};

export default AnnouncementsList;
