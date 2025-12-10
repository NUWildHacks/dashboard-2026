"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DASHBOARD_ANNOUNCEMENTS_PATH } from "@/constants/routes";
import { cn } from "@/lib/utils";
import User from "@/types/user";

import { useAnnoucementDialog } from "../../_hooks/use-announcement-dialog";
import { useAnnouncements } from "../../_hooks/use-announcements";

import AnnouncementDialog from "./announcement-dialog";
import AnnouncementsList from "./announcements-list";

type LiveAnnouncementsProps = {
  userRole: User["role"];
};

const LiveAnnouncements = ({ userRole }: LiveAnnouncementsProps) => {
  const useAnnouncementsReturn = useAnnouncements(userRole, { limitCount: 3 });
  const { announcements } = useAnnouncementsReturn;

  const useAnnouncementDialogReturn = useAnnoucementDialog(announcements);

  return (
    <>
      <Card className="shadow-none row-span-3 md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Live Announcements</CardTitle>
          <CardDescription>
            Stay in the loop with real-time updates on schedule changes, surprise events, and important notices.
          </CardDescription>
        </CardHeader>
        <CardContent
          className={cn(
            "flex-1 flex flex-col gap-4 justify-center",
            announcements.length === 0 ? "items-center" : "items-start"
          )}
        >
          <AnnouncementsList {...useAnnouncementsReturn} {...useAnnouncementDialogReturn} />
        </CardContent>
        <CardFooter className="flex-row-reverse">
          <Link href={DASHBOARD_ANNOUNCEMENTS_PATH}>
            <Button variant="link">
              View all announcements
              <ArrowRight />
            </Button>
          </Link>
        </CardFooter>
      </Card>
      <AnnouncementDialog {...useAnnouncementDialogReturn} />
    </>
  );
};

export default LiveAnnouncements;
