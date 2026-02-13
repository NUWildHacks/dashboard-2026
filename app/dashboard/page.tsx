import {
  LiveAnnouncements,
  QRCode,
  Statistics,
  Countdown,
  UpcomingEvents,
  VenueMap,
} from "@/app/dashboard/_components";
import { ADMIN, DASHBOARD_PATH, LOGIN_PATH } from "@/constants";
import { calculateStatistics, getAuthenticatedUser, getConfigDocSnapshot } from "@/lib";
import type { WildHacksConfig } from "@/types";

const DashboardPage = async () => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`;

  const { id: userId, role } = await getAuthenticatedUser(redirectPath);

  const configDocSnapshot = await getConfigDocSnapshot();
  const wildhacksConfig = configDocSnapshot.data() as WildHacksConfig;

  const wildHacksStatistics = role === ADMIN ? await calculateStatistics() : undefined;

  return (
    <>
      <div className="grid gap-4 auto-rows-min md:grid-cols-2 lg:grid-cols-4">
        <Countdown {...wildhacksConfig} />
        <QRCode userId={userId} />
        <VenueMap />
      </div>
      <LiveAnnouncements userRole={role} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UpcomingEvents />
        {wildHacksStatistics && <Statistics {...wildHacksStatistics} />}
      </div>
    </>
  );
};

export default DashboardPage;
