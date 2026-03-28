import { getFirestore } from "firebase-admin/firestore";

import { QRCode, Statistics, Countdown, UpcomingEvents, VenueMap } from "@/app/dashboard/_components";
import { ADMIN, DASHBOARD_PATH, LOGIN_PATH, PARTICIPANT, TEAM_MATCHING_INTAKE_COLLECTION } from "@/constants";
import { calculateStatistics, cn, getAuthenticatedUser, getConfigDocSnapshot } from "@/lib";
import type { WildHacksConfig } from "@/types";

import TeamMatchingIntake from "./_components/team-matching-intake";

const DashboardPage = async () => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`;

  const { id: userId, role, first_name, last_name, email, ...userProfile } = await getAuthenticatedUser(redirectPath);
  const school = "school" in userProfile ? userProfile.school : "";
  const field_of_study = "field_of_study" in userProfile ? userProfile.field_of_study : "";

  const configDocSnapshot = await getConfigDocSnapshot();
  const wildhacksConfig = configDocSnapshot.data() as WildHacksConfig;

  const wildHacksStatistics = role === ADMIN ? await calculateStatistics() : undefined;

  let hasSubmittedTeamMatching = false;
  if (role === PARTICIPANT) {
    const db = getFirestore();
    const doc = await db.collection(TEAM_MATCHING_INTAKE_COLLECTION).doc(userId).get();
    hasSubmittedTeamMatching = doc.exists;
  }

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
      <div className={cn("grid grid-cols-1 gap-4", (wildHacksStatistics || role === PARTICIPANT) && "lg:grid-cols-2")}>
        <UpcomingEvents />
        {wildHacksStatistics && <Statistics {...wildHacksStatistics} />}
        {role === PARTICIPANT && (
          <TeamMatchingIntake
            hasSubmitted={hasSubmittedTeamMatching}
            firstName={first_name}
            lastName={last_name}
            email={email}
            school={school as string}
            fieldOfStudy={field_of_study as string}
            eventStartTime={wildhacksConfig.start_time}
          />
        )}
      </div>
    </>
  );
};

export default DashboardPage;
