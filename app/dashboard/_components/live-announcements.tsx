"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { AnnouncementDialog, AnnouncementsList } from "@/app/dashboard/announcements/_components";
import { useAnnouncements } from "@/app/dashboard/announcements/_hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DASHBOARD_ANNOUNCEMENTS_PATH } from "@/constants";
import { useItemDialog } from "@/hooks";

import type { Announcement } from "../announcements/types";

const LiveAnnouncements = () => {
  const useAnnouncementsReturn = useAnnouncements({ limitCount: 3 });
  const { announcements } = useAnnouncementsReturn;

  const useAnnouncementDialogReturn = useItemDialog<Announcement>(announcements);

  return (
    <>
      <Card className="shadow-xs flex-1">
        <CardHeader>
          <CardTitle>Live Announcements</CardTitle>
          <CardDescription>
            Stay in the loop with real-time updates on schedule changes, surprise events, and important notices.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-start items-center gap-4">
          <AnnouncementsList {...useAnnouncementsReturn} {...useAnnouncementDialogReturn} />
        </CardContent>
        <CardFooter className="flex-row-reverse">
          <Link href={DASHBOARD_ANNOUNCEMENTS_PATH} aria-label="View all announcements">
            <Button variant="link">
              View all announcements
              <ArrowRight aria-hidden="true" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
      <AnnouncementDialog {...useAnnouncementDialogReturn} />
    </>
  );
};

export default LiveAnnouncements;
