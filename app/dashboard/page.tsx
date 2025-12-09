import "@/config/firebase-admin";
import { redirect } from "next/navigation";

import { DASHBOARD_PATH, LOGIN_PATH, REGISTRATION_PATH } from "@/constants/routes";
import { getEventConfigDocSnapshot, getEventStatisticsDocSnapshot } from "@/lib/event";
import { verifySession } from "@/lib/session";
import { getUserDocSnapshot } from "@/lib/user";
import "@/config/firebase-client";
import { EventConfig, EventStatistics as EventStatisticsType } from "@/types/event";
import User from "@/types/user";

import LiveAnnouncements from "./_components/_announcements/live-announcements";
import QRCode from "./_components/qr-code";
import Statistics from "./_components/statistics";
import TimeRemaining from "./_components/time-remaining";
import UpcomingEvents from "./_components/upcoming-events";
import VenueMap from "./_components/venue-map";

export default async function Dashboard() {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  const { role } = userDocSnapshot.data() as User;

  const eventConfigDocSnapshot = await getEventConfigDocSnapshot();
  const eventConfig = eventConfigDocSnapshot.data() as EventConfig;

  const eventStatisticsDocSnapshot = await getEventStatisticsDocSnapshot();
  const eventStatistics = eventStatisticsDocSnapshot.data() as EventStatisticsType;

  return (
    <>
      <div className="grid gap-4 auto-rows-min md:grid-cols-2 lg:grid-cols-4">
        <TimeRemaining {...eventConfig} />
        <QRCode userId={userId} />
        <VenueMap />
      </div>
      <div className="grid gap-4 auto-rows-min grid-rows-3 md:grid-cols-2 lg:grid-cols-4">
        <LiveAnnouncements userRole={role} />
      </div>
      <div className="grid gap-4 auto-rows-min grid-rows-2 md:grid-cols-2 lg:grid-cols-4">
        <UpcomingEvents />
        <Statistics {...eventStatistics} />
      </div>
    </>
  );
}
