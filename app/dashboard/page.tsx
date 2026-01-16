import "@/config/firebase-admin";
import { redirect } from "next/navigation";

import {
  LiveAnnouncements,
  QRCode,
  Statistics,
  TimeRemaining,
  UpcomingEvents,
  VenueMap,
} from "@/app/dashboard/_components";
import "@/config/firebase-client";
import { DASHBOARD_PATH, LOGIN_PATH, REGISTRATION_PATH } from "@/constants";
import { getConfigDocSnapshot, getStatisticsDocSnapshot, getUserDocSnapshot, verifySession } from "@/lib";
import type { User, WildHacksConfig, WildHacksStatistics } from "@/types";

const DashboardPage = async () => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  const { role } = userDocSnapshot.data() as Omit<User, "id">;

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

export default DashboardPage;
