import "@/config/firebase-admin";
import { redirect } from "next/navigation";

import { DASHBOARD_PATH, LOGIN_PATH, REGISTRATION_PATH } from "@/constants/routes";
import { getEventStatisticsDocSnapshot } from "@/lib/event";
import { verifySession } from "@/lib/session";
import { getUserDocSnapshot } from "@/lib/user";
import "@/config/firebase-client";
import { EventStatistics as EventStatisticsType } from "@/types/event";
import User from "@/types/user";

import LiveAnnouncements from "./_components/_announcements/live-announcements";
import EventStatistics from "./_components/event-statistics";
import MilestoneCountdown from "./_components/milestone-countdown";
import QRCode from "./_components/qr-code";
import UpcomingEvents from "./_components/upcoming-events";
import VenueMap from "./_components/venue-map";

export default async function Dashboard() {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  const { role } = userDocSnapshot.data() as User;

  const eventStatisticsDocSnapshot = await getEventStatisticsDocSnapshot();
  const eventStatistics = eventStatisticsDocSnapshot.data() as EventStatisticsType;

  return (
    <div className="flex-1 grid gap-4 auto-rows-min md:grid-rows-7 md:grid-cols-2 lg:grid-cols-4">
      <MilestoneCountdown />
      <QRCode userId={userId} />
      <VenueMap />
      <LiveAnnouncements userRole={role} />
      <UpcomingEvents />
      <EventStatistics {...eventStatistics} />
    </div>
  );
}
