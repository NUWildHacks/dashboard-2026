import { redirect } from "next/navigation";

import { DASHBOARD_JUDGING_ROUND_2_PATH, DASHBOARD_PATH, JUDGE, LOGIN_PATH } from "@/constants";
import { getAuthenticatedUser } from "@/lib";

import { JudgingDisplay } from "../_components";
import { getProjectsWithMetadata } from "../lib";

const JudgingRound2Page = async () => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_JUDGING_ROUND_2_PATH)}`;

  const user = await getAuthenticatedUser(redirectPath);
  if (user.role !== JUDGE) redirect(DASHBOARD_PATH);

  const projectsWithMetadata = await getProjectsWithMetadata(user.id);

  return (
    <JudgingDisplay
      judgeId={user.id}
      projectsWithMetadata={projectsWithMetadata}
      currentPath={DASHBOARD_JUDGING_ROUND_2_PATH}
    />
  );
};

export default JudgingRound2Page;
