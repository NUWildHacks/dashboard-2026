import "@/config/firebase-admin";
import { redirect } from "next/navigation";

import { DASHBOARD_PATH, LOGIN_PATH, REGISTRATION_PATH } from "@/constants/routes.constants";
import { verifySession } from "@/lib/session.lib";
import { getUserDocSnapshot } from "@/lib/user.lib";
import "@/config/firebase-client";
import { getConfigDocSnapshot, getStatisticsDocSnapshot } from "@/lib/wildhacks.lib";
import User from "@/types/user.types";
import { WildHacksConfig, WildHacksStatistics } from "@/types/wildhacks.types";

import LiveAnnouncements from "./_components/live-announcements";
import QRCode from "./_components/qr-code";
import Statistics from "./_components/statistics";
import TimeRemaining from "./_components/time-remaining";
import UpcomingEvents from "./_components/upcoming-events";
import VenueMap from "./_components/venue-map";

const Dashboard = async () => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  const { role } = userDocSnapshot.data() as User;

  const configDocSnapshot = await getConfigDocSnapshot();
  const wildhacksConfig = configDocSnapshot.data() as WildHacksConfig;

  const statisticsDocSnapshot = await getStatisticsDocSnapshot();
  const wildHacksStatistics = statisticsDocSnapshot.data() as WildHacksStatistics;

  return (
    <>
      <div className="grid gap-4 auto-rows-min md:grid-cols-2 lg:grid-cols-4">
        <TimeRemaining {...wildhacksConfig} />
        <QRCode userId={userId} />
        <VenueMap />
      </div>
      <div className="grid gap-4 auto-rows-min grid-rows-3 md:grid-cols-2 lg:grid-cols-4">
        <LiveAnnouncements userRole={role} />
      </div>
      <div className="grid gap-4 auto-rows-min grid-rows-2 md:grid-cols-2 lg:grid-cols-4">
        <UpcomingEvents />
        <Statistics {...wildHacksStatistics} />
      </div>
    </>
  );
};

export default Dashboard;
