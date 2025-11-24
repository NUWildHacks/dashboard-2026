"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DASHBOARD_ANNOUNCEMENTS_PATH } from "@/constants/routes";
import { Announcement } from "@/types/announcement";

import AnnouncementsList from "./announcements-list";

type LiveAnnouncementsProps = {
  announcements: Announcement[];
};

export default function LiveAnnouncements({ announcements }: LiveAnnouncementsProps) {
  return (
    <Card className="shadow-none row-span-3 md:col-span-2 lg:col-span-4">
      <CardHeader>
        <CardTitle>Live Announcements</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <AnnouncementsList announcements={announcements} />
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
  );
}
