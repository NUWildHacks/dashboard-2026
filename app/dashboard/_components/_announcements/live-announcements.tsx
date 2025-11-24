"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DASHBOARD_ANNOUNCEMENTS_PATH } from "@/constants/routes";
import User from "@/types/user";

import { useAnnoucementDialog } from "../../_hooks/use-announcement-dialog";
import { useLiveAnnouncements } from "../../_hooks/use-live-announcements";

import AnnouncementDialog from "./announcement-dialog";
import AnnouncementsList from "./announcements-list";

type LiveAnnouncementsProps = {
  userRole: User["role"];
};

export default function LiveAnnouncements({ userRole }: LiveAnnouncementsProps) {
  const { announcements } = useLiveAnnouncements(userRole);

  const useAnnouncementDialogReturn = useAnnoucementDialog(announcements);

  return (
    <>
      <Card className="shadow-none row-span-3 md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Live Announcements</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <AnnouncementsList announcements={announcements} {...useAnnouncementDialogReturn} />
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
}
