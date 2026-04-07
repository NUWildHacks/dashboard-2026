import { redirect } from "next/navigation";

import { ADMIN, DASHBOARD_CROWD_FAVORITE_PATH, DASHBOARD_PATH, LOGIN_PATH, PARTICIPANT } from "@/constants";
import { getAuthenticatedUser } from "@/lib";
import type { ParticipantUser } from "@/types";

import {
  CrowdFavoriteAdminProjectList,
  CrowdFavoriteOptInForm,
  CrowdFavoriteOptedInView,
  CrowdFavoriteVoteForm,
} from "./_components";
import {
  getAllCrowdFavoriteProjects,
  getAllParticipantUsers,
  getCrowdFavoriteProject,
  getCrowdFavoriteProjectsWithVoteCount,
} from "./_lib";
import {
  hasCrowdFavoriteVotingStarted,
  isCrowdFavoriteOptInOpen,
  isCrowdFavoritePresentationPhase,
  isCrowdFavoriteVotingClosed,
  isCrowdFavoriteVotingOpen,
} from "./constants";

const CrowdFavoritePage = async () => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_CROWD_FAVORITE_PATH)}`;

  const user = await getAuthenticatedUser(redirectPath);
  if (user.role !== PARTICIPANT && user.role !== ADMIN) redirect(DASHBOARD_PATH);

  if (user.role === ADMIN) {
    const showVoteCount = hasCrowdFavoriteVotingStarted();
    const projects = await getCrowdFavoriteProjectsWithVoteCount(showVoteCount);

    return (
      <div className="flex flex-1 flex-col gap-6">
        <section className="flex flex-col gap-2">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Crowd Favorite</p>
          <h1 className="text-2xl font-semibold">Crowd favorite projects</h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            {showVoteCount
              ? "Projects are sorted by votes. Voting has started, so vote counts are now visible."
              : "Projects are sorted by oldest opt-in until voting starts."}
          </p>
        </section>

        <CrowdFavoriteAdminProjectList projects={projects} showVoteCount={showVoteCount} />
      </div>
    );
  }

  const participantUser = user as ParticipantUser;
  const crowdFavoriteProjectId = participantUser.crowd_favorite_project_id;
  const optInOpen = isCrowdFavoriteOptInOpen();
  const inPresentationPhase = isCrowdFavoritePresentationPhase();
  const votingOpen = isCrowdFavoriteVotingOpen();
  const votingClosed = isCrowdFavoriteVotingClosed();

  const crowdFavoriteProject = crowdFavoriteProjectId ? await getCrowdFavoriteProject(crowdFavoriteProjectId) : null;
  const participantUsers = !crowdFavoriteProject && !votingOpen ? await getAllParticipantUsers() : null;
  const crowdFavoriteProjects = votingOpen ? await getAllCrowdFavoriteProjects() : [];

  return (
    <div className="flex flex-1 flex-col gap-6">
      <section className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Crowd Favorite</p>
        <h1 className="text-2xl font-semibold">Participant voting hub</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          This route is the dedicated entry point for crowd favorite opt-in, presentation instructions, and the later
          voting flow.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-sm font-semibold">Opt-in / Opt-out</p>
          <p className="mt-2 text-sm text-muted-foreground">Available until Sunday at 2:15 PM.</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-sm font-semibold">Presentation</p>
          <p className="mt-2 text-sm text-muted-foreground">Participants present in LR4 before voting opens.</p>
        </div>
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <p className="text-sm font-semibold">Voting</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Voting opens after presentations and stays editable until 3:45 PM.
          </p>
        </div>
      </section>

      {votingOpen ? (
        <CrowdFavoriteVoteForm
          projects={crowdFavoriteProjects.map((project) => ({
            id: project.id,
            project_name: project.project_name,
          }))}
          initialVotedProjectId={participantUser.voted_for_project_id}
        />
      ) : crowdFavoriteProject ? (
        <CrowdFavoriteOptedInView crowdFavoriteProject={crowdFavoriteProject} canOptOut={optInOpen} />
      ) : (
        <>
          {optInOpen ? (
            <CrowdFavoriteOptInForm callerFirstName={participantUser.first_name} callerEmail={participantUser.email} />
          ) : inPresentationPhase ? (
            <section className="flex flex-col gap-3 rounded-lg border bg-card p-6 shadow-sm">
              <p className="text-sm font-semibold">Presentation phase instructions</p>
              <p className="text-sm text-muted-foreground">
                Your team is not opted in. If you want to vote for crowd favorite, be in LR4 by 2:15 PM and stay for
                presentations until voting opens.
              </p>
            </section>
          ) : votingClosed ? (
            <section className="flex flex-col gap-3 rounded-lg border bg-card p-6 shadow-sm">
              <p className="text-sm font-semibold">Voting is closed</p>
              <p className="text-sm text-muted-foreground">
                The crowd favorite voting window has ended. Final tally is now locked.
              </p>
            </section>
          ) : (
            <section className="flex flex-col gap-4 rounded-lg border bg-card p-6 shadow-sm">
              <div>
                <p className="text-sm font-semibold">Crowd favorite opt-in is closed</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  The opt-in form is only available during the configured phase window.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Loaded {participantUsers?.length ?? 0} participant users for downstream voting flow.
              </p>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default CrowdFavoritePage;
