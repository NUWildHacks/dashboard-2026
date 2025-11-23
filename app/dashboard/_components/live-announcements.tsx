"use client";

import { MegaphoneOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { DASHBOARD_ANNOUNCEMENTS_PATH } from "@/constants/routes";
import { Announcement } from "@/types/announcement";

export default function LiveAnnouncements() {
  const [announcements, _setAnnouncements] = useState<Announcement[]>([]);

  return (
    <Card className="row-span-3 md:col-span-2 lg:col-span-4">
      <CardHeader>
        <CardTitle>Live Announcements</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {announcements.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MegaphoneOff />
              </EmptyMedia>
              <EmptyTitle>No announcements</EmptyTitle>
              <EmptyDescription>Check back in closer to the event start date.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            {announcements.map((announcement) => (
              <div key={announcement.id}>{announcement.title}</div>
            ))}
          </>
        )}
      </CardContent>
      <CardFooter className="flex-row-reverse">
        <Link href={DASHBOARD_ANNOUNCEMENTS_PATH}>
          <Button>View all announcements</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
