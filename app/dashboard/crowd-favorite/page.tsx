import { redirect } from "next/navigation";

import { DASHBOARD_CROWD_FAVORITE_PATH, DASHBOARD_PATH, LOGIN_PATH, PARTICIPANT } from "@/constants";
import { getAuthenticatedUser } from "@/lib";
import type { CrowdFavoriteProject, ParticipantUser } from "@/types";

import { CrowdFavoriteOptInForm } from "./_components";
import { getAllParticipantUsers, getCrowdFavoriteProject } from "./_lib";
import { isCrowdFavoriteOptInOpen } from "./constants";

const formatTeamMember = (member: CrowdFavoriteProject["team_members"][number]) => {
  return `${member.first_name} <${member.email}>`;
};

const CrowdFavoritePage = async () => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_CROWD_FAVORITE_PATH)}`;

  const user = await getAuthenticatedUser(redirectPath);
  if (user.role !== PARTICIPANT) redirect(DASHBOARD_PATH);

  const participantUser = user as ParticipantUser;
  const crowdFavoriteProjectId = participantUser.crowd_favorite_project_id;
  const optInOpen = isCrowdFavoriteOptInOpen();

  const crowdFavoriteProject = crowdFavoriteProjectId ? await getCrowdFavoriteProject(crowdFavoriteProjectId) : null;
  const participantUsers = crowdFavoriteProject ? null : await getAllParticipantUsers();

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

      {crowdFavoriteProject ? (
        <section className="flex flex-col gap-4 rounded-lg border bg-card p-6 shadow-sm">
          <div>
            <p className="text-sm font-semibold">Your team is opted in</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your current crowd favorite project details are loaded below.
            </p>
          </div>
          <div className="grid gap-2 text-sm">
            <p>
              <span className="font-medium">Project:</span> {crowdFavoriteProject.project_name}
            </p>
            <p className="break-all">
              <span className="font-medium">Devpost:</span> {crowdFavoriteProject.devpost_url}
            </p>
            <div>
              <p className="font-medium">Team members</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                {crowdFavoriteProject.team_members.map((member) => (
                  <li key={member.id}>{formatTeamMember(member)}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : (
        <>
          {optInOpen ? (
            <CrowdFavoriteOptInForm callerFirstName={participantUser.first_name} callerEmail={participantUser.email} />
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
