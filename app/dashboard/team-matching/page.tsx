import { redirect } from "next/navigation";

import { ADMIN, DASHBOARD_PATH, DASHBOARD_TEAM_MATCHING_PATH, LOGIN_PATH } from "@/constants";
import { getAuthenticatedUser } from "@/lib";

import { TeamMatchingAdmin } from "./_components/team-matching-admin";
import { getIntakeEntries, getRuns, getSettings } from "./_lib/lib";

const TeamMatchingPage = async () => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_TEAM_MATCHING_PATH)}`;
  const { role } = await getAuthenticatedUser(redirectPath);
  if (role !== ADMIN) redirect(DASHBOARD_PATH);

  const [entries, runs, settings] = await Promise.all([getIntakeEntries(), getRuns(), getSettings()]);

  return (
    <div className="flex-1 flex flex-col gap-6">
      <TeamMatchingAdmin entries={entries} runs={runs} settings={settings} />
    </div>
  );
};

export default TeamMatchingPage;
