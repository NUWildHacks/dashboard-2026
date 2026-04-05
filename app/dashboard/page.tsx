import { QRCode, Statistics, Countdown, UpcomingEvents, VenueMap, UploadResume } from "@/app/dashboard/_components";
import { ADMIN, DASHBOARD_PATH, LOGIN_PATH, PARTICIPANT } from "@/constants";
import { calculateStatistics, cn, getAuthenticatedUser, getConfigDocSnapshot } from "@/lib";
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
        <div className="md:col-span-2">
          <Countdown {...wildhacksConfig} />
        </div>
        {role === PARTICIPANT && (
          <div className="md:col-span-1">
            <QRCode userId={userId} />
          </div>
        )}
        <div className={cn(role === PARTICIPANT ? "md:col-span-1" : "md:col-span-2")}>
          <VenueMap />
        </div>
      </div>
      {role === PARTICIPANT && (
        <div>
          <UploadResume userId={userId} />
        </div>
      )}
      <div className={cn("grid grid-cols-1 gap-4", role === ADMIN && "lg:grid-cols-2")}>
        <UpcomingEvents />
        {wildHacksStatistics && <Statistics {...wildHacksStatistics} />}
      </div>
    </>
  );
};

export default DashboardPage;
