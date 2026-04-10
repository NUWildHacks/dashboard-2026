import { getFirestore } from "firebase-admin/firestore";

import { QRCode, Statistics, Countdown, UpcomingEvents, VenueMap, ResumeUpload } from "@/app/dashboard/_components";
import {
  ADMIN,
  DASHBOARD_PATH,
  LOGIN_PATH,
  PARTICIPANT,
  TEAM_MATCHING_INTAKE_COLLECTION,
  TEAM_MATCHING_INTAKE_COLLECTION_DEV,
  TEAM_MATCHING_RUNS_COLLECTION,
  TEAM_MATCHING_SUGGESTIONS_COLLECTION,
} from "@/constants";
import { calculateStatistics, cn, getAuthenticatedUser, getConfigDocSnapshot } from "@/lib";
import type { TeamMatchingRun, TeamSuggestion, UserSuggestions, WildHacksConfig } from "@/types";

import { TeamMatchingGate } from "./_components/team-matching-gate";
import TeamMatchingIntake from "./_components/team-matching-intake";
import { getResumeMetadata } from "./_lib/resume";

async function fetchTopSuggestions(userId: string): Promise<TeamSuggestion[]> {
  const db = getFirestore();
  const topRunsSnap = await db
    .collection(TEAM_MATCHING_RUNS_COLLECTION)
    .where("is_top", "==", true)
    .orderBy("run_at", "desc")
    .get();
  const topRuns = topRunsSnap.docs.map((d) => d.data() as TeamMatchingRun);

  const seen = new Set<string>();
  const suggestions: TeamSuggestion[] = [];

  for (const run of topRuns) {
    if (suggestions.length >= 3) break;
    const snap = await db
      .collection(TEAM_MATCHING_SUGGESTIONS_COLLECTION)
      .doc(`${run.id}_${userId}`)
      .get();
    if (!snap.exists) continue;
    const data = snap.data() as UserSuggestions;
    for (const s of data.suggestions) {
      if (suggestions.length >= 3) break;
      const key = s.members.map((m) => m.user_id).sort().join(",");
      if (!seen.has(key)) {
        seen.add(key);
        suggestions.push(s);
      }
    }
  }

  return suggestions;
}

const DashboardPage = async () => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`;

  const { id: userId, role, first_name, last_name, email, ...userProfile } = await getAuthenticatedUser(redirectPath);
  const school = "school" in userProfile ? userProfile.school : "";
  const field_of_study = "field_of_study" in userProfile ? userProfile.field_of_study : "";

  const configDocSnapshot = await getConfigDocSnapshot();
  const wildhacksConfig = configDocSnapshot.data() as WildHacksConfig;
  const resultsReleased = wildhacksConfig.results_released ?? false;

  const wildHacksStatistics = role === ADMIN ? await calculateStatistics() : undefined;

  const resumeMetadata = await getResumeMetadata(userId);
  const fileName = resumeMetadata?.file_name;

  const db = getFirestore();

  let hasSubmittedTeamMatching = false;
  if (role === PARTICIPANT) {
    const doc = await db.collection(TEAM_MATCHING_INTAKE_COLLECTION).doc(userId).get();
    hasSubmittedTeamMatching = doc.exists;
  }
  if (role === ADMIN) {
    const doc = await db.collection(TEAM_MATCHING_INTAKE_COLLECTION_DEV).doc(userId).get();
    hasSubmittedTeamMatching = doc.exists;
  }


  // Only admins get the real-time results preview tile.
  const initialSuggestions = role === ADMIN ? await fetchTopSuggestions(userId) : [];

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
        {role === ADMIN && (
        <div className="md:col-span-1">
          <TeamMatchingGate
            hasSubmitted={hasSubmittedTeamMatching}
            initialReleased={resultsReleased}
            initialSuggestions={initialSuggestions}
            firstName={first_name}
            lastName={last_name}
            email={email}
            school={school as string}
            fieldOfStudy={field_of_study as string}
            eventStartTime={wildhacksConfig.start_time}
          />
        </div>
        )}
        <div className={cn((role === PARTICIPANT || role === ADMIN) ? "md:col-span-1" : "md:col-span-2")}>
          <VenueMap />
        </div>
      </div>

      {role === PARTICIPANT && (
        <div className="grid gap-4 auto-rows-min md:grid-cols-2">
          <ResumeUpload fileName={fileName} />
          <TeamMatchingIntake
            hasSubmitted={hasSubmittedTeamMatching}
            firstName={first_name}
            lastName={last_name}
            email={email}
            school={school as string}
            fieldOfStudy={field_of_study as string}
            eventStartTime={wildhacksConfig.start_time}
          />
        </div>
      )}

      <div className={cn("grid grid-cols-1 gap-4", wildHacksStatistics && "lg:grid-cols-2")}>
        <UpcomingEvents />
        {wildHacksStatistics && <Statistics {...wildHacksStatistics} />}
      </div>
    </>
  );
};

export default DashboardPage;
