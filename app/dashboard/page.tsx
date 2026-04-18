import { getFirestore } from "firebase-admin/firestore";

import {
  CrowdFavoriteAdminLink,
  CrowdFavoriteParticipantLink,
  CrowdFavoritePresentationTile,
  QRCode,
  Statistics,
  Countdown,
  UpcomingEvents,
  VenueMap,
  ResumeUpload,
} from "@/app/dashboard/_components";
import {
  getAllCrowdFavoriteProjects,
  getCrowdFavoriteProjectForUser,
  getUserVotedProjectId,
} from "@/app/dashboard/crowd-favorite/_lib";
import {
  hasCrowdFavoriteOptInStarted,
  isCrowdFavoriteOptInOpen,
  isCrowdFavoritePresentationPhase,
  isCrowdFavoriteVotingOpen,
} from "@/app/dashboard/crowd-favorite/constants";
import {
  ADMIN,
  DASHBOARD_PATH,
  LOGIN_PATH,
  PARTICIPANT,
  TEAM_MATCHING_FORMATIONS_COLLECTION,
  TEAM_MATCHING_FORMATIONS_COLLECTION_PROD,
  TEAM_MATCHING_INTAKE_COLLECTION,
  TEAM_MATCHING_INTAKE_COLLECTION_DEV,
  TEAM_MATCHING_RUNS_COLLECTION,
  TEAM_MATCHING_RUNS_COLLECTION_PROD,
  TEAM_MATCHING_TEAMS_COLLECTION,
  TEAM_MATCHING_TEAMS_COLLECTION_PROD,
} from "@/constants";
import { calculateStatistics, cn, getAuthenticatedUser, getConfigDocSnapshot } from "@/lib";
import type { MatchedTeam, TeamFormation, TeamMatchingRun, TeamSuggestion, WildHacksConfig } from "@/types";

import { TeamMatchingGate } from "./_components/team-matching-gate";
import { getResumeMetadata } from "./_lib/resume";

async function fetchTopSuggestions(
  userId: string,
  collections: {
    runs: string;
    teams: string;
    formations: string;
  }
): Promise<TeamSuggestion[]> {
  const db = getFirestore();
  const topRunsSnap = await db.collection(collections.runs).where("is_top", "==", true).orderBy("run_at", "desc").get();
  const topRuns = topRunsSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as TeamMatchingRun);

  const results: TeamSuggestion[] = [];
  const seen = new Set<string>();

  const tryAdd = (team: MatchedTeam & { id: string }) => {
    if (results.length >= 3) return;
    const key = team.members
      .map((m) => m.user_id)
      .sort()
      .join(",");
    if (seen.has(key)) return;
    seen.add(key);
    results.push({
      rank: (results.length + 1) as 1 | 2 | 3,
      team_id: team.id,
      members: team.members,
      score: team.score,
      match_reasons: team.match_reasons,
      where_to_meet: team.where_to_meet,
    });
  };

  for (const run of topRuns) {
    if (results.length >= 3) break;

    const teamsSnap = await db.collection(collections.teams).where("run_id", "==", run.id).get();
    const primary = teamsSnap.docs
      .map((d) => ({ id: d.id, ...d.data() }) as MatchedTeam)
      .find((t) => t.members.some((m) => m.user_id === userId));
    if (primary) tryAdd(primary);

    if (results.length >= 3) break;

    const altDocs = await Promise.all(
      [1, 2].map((i) => db.collection(collections.formations).doc(`${run.id}_alt${i}`).get())
    );
    for (const altDoc of altDocs) {
      if (!altDoc.exists || results.length >= 3) continue;
      const formation = altDoc.data() as TeamFormation;
      const altTeam = formation.teams.find((t) => t.members.some((m) => m.user_id === userId));
      if (altTeam) tryAdd(altTeam);
    }
  }

  return results;
}

const DashboardPage = async () => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PATH)}`;

  const { id: userId, role, first_name, last_name, email, ...userProfile } = await getAuthenticatedUser(redirectPath);
  const school = "school" in userProfile ? userProfile.school : "";
  const field_of_study = "field_of_study" in userProfile ? userProfile.field_of_study : "";

  const configDocSnapshot = await getConfigDocSnapshot();
  const wildhacksConfig = configDocSnapshot.data() as WildHacksConfig;
  const wildHacksStatistics = role === ADMIN ? await calculateStatistics() : undefined;

  const resumeMetadata = await getResumeMetadata(userId);
  const fileName = resumeMetadata?.file_name;
  const showAdminCrowdFavoriteLink = role === ADMIN && (await hasCrowdFavoriteOptInStarted(wildhacksConfig));
  const participantOptInOpen = await isCrowdFavoriteOptInOpen(wildhacksConfig);
  const participantVotingOpen = await isCrowdFavoriteVotingOpen(wildhacksConfig);
  const showParticipantCrowdFavoriteLink = role === PARTICIPANT && (participantOptInOpen || participantVotingOpen);
  const showPresentationTile = role === PARTICIPANT && (await isCrowdFavoritePresentationPhase(wildhacksConfig));

  const [crowdFavoriteProject, votingProjects, votedForProjectId] = await Promise.all([
    role === PARTICIPANT ? getCrowdFavoriteProjectForUser(userId) : Promise.resolve(null),
    participantVotingOpen ? getAllCrowdFavoriteProjects() : Promise.resolve([]),
    participantVotingOpen && role === PARTICIPANT ? getUserVotedProjectId(userId) : Promise.resolve(null),
  ]);

  const isOptedIn = crowdFavoriteProject !== null;

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

  const adminMode = wildhacksConfig.team_matching_mode ?? "dev";
  const suggestionCollections =
    role === PARTICIPANT
      ? {
          runs: TEAM_MATCHING_RUNS_COLLECTION_PROD,
          teams: TEAM_MATCHING_TEAMS_COLLECTION_PROD,
          formations: TEAM_MATCHING_FORMATIONS_COLLECTION_PROD,
        }
      : adminMode === "prod"
        ? {
            runs: TEAM_MATCHING_RUNS_COLLECTION_PROD,
            teams: TEAM_MATCHING_TEAMS_COLLECTION_PROD,
            formations: TEAM_MATCHING_FORMATIONS_COLLECTION_PROD,
          }
        : {
            runs: TEAM_MATCHING_RUNS_COLLECTION,
            teams: TEAM_MATCHING_TEAMS_COLLECTION,
            formations: TEAM_MATCHING_FORMATIONS_COLLECTION,
          };

  const initialSuggestions =
    role === ADMIN || role === PARTICIPANT ? await fetchTopSuggestions(userId, suggestionCollections) : [];

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
        <div className={cn(role === PARTICIPANT || showAdminCrowdFavoriteLink ? "md:col-span-1" : "md:col-span-2")}>
          <VenueMap />
        </div>
        {showAdminCrowdFavoriteLink && (
          <div className="md:col-span-1">
            <CrowdFavoriteAdminLink />
          </div>
        )}
      </div>

      {role === PARTICIPANT && (
        <div className="grid gap-4 auto-rows-min md:grid-cols-2">
          <ResumeUpload fileName={fileName} />
          {showParticipantCrowdFavoriteLink ? (
            <CrowdFavoriteParticipantLink
              votingOpen={participantVotingOpen}
              optInOpen={participantOptInOpen}
              isOptedIn={isOptedIn}
              callerFirstName={first_name}
              callerEmail={email}
              crowdFavoriteProject={crowdFavoriteProject}
              votingProjects={votingProjects.map((p) => ({ id: p.id, project_name: p.project_name }))}
              initialVotedProjectId={votedForProjectId ?? undefined}
            />
          ) : showPresentationTile ? (
            <CrowdFavoritePresentationTile />
          ) : (
            <TeamMatchingGate
              hasSubmitted={hasSubmittedTeamMatching}
              initialSuggestions={initialSuggestions}
              firstName={first_name}
              lastName={last_name}
              email={email}
              school={school as string}
              fieldOfStudy={field_of_study as string}
              eventStartTime={wildhacksConfig.start_time}
            />
          )}
        </div>
      )}
      {/* 
      {role === ADMIN && hasSubmittedTeamMatching && (
        <div className="md:col-span-1">
          <TeamMatchingGate
            hasSubmitted={hasSubmittedTeamMatching}
            initialSuggestions={initialSuggestions}
            releasedField="results_released_dev"
            firstName={first_name}
            lastName={last_name}
            email={email}
            school={school as string}
            fieldOfStudy={field_of_study as string}
            eventStartTime={wildhacksConfig.start_time}
          />
        </div>
      )}
*/}
      <div className={cn("grid grid-cols-1 gap-4", wildHacksStatistics && "lg:grid-cols-2")}>
        <UpcomingEvents />
        {wildHacksStatistics && <Statistics {...wildHacksStatistics} />}
      </div>
    </>
  );
};

export default DashboardPage;
