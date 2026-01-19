"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { AnnouncementDialog, AnnouncementsList } from "@/app/dashboard/announcements/_components";
import { useAnnouncements } from "@/app/dashboard/announcements/_hooks";
import type { Announcement } from "@/app/dashboard/announcements/_types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DASHBOARD_ANNOUNCEMENTS_PATH } from "@/constants";
import { useDialog } from "@/hooks";
import { cn } from "@/lib";
import type { User } from "@/types";

type LiveAnnouncementsProps = {
  userRole: User["role"];
};

const LiveAnnouncements = ({ userRole }: LiveAnnouncementsProps) => {
  const useAnnouncementsReturn = useAnnouncements(userRole, { limitCount: 3 });
  const { announcements } = useAnnouncementsReturn;

  const useAnnouncementDialogReturn = useDialog<Announcement>(announcements);

  return (
    <>
      <Card className="shadow-xs flex-1">
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
