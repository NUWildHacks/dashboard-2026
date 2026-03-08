import { redirect } from "next/navigation";

import { DASHBOARD_JUDGING_PATH, DASHBOARD_PATH, JUDGE, LOGIN_PATH } from "@/constants";
import { getAuthenticatedUser } from "@/lib";

import { JudgingDisplay } from "./_components";
import { getAssignedProjectsWithJudgingForms } from "./lib";

const JudgingPage = async () => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_JUDGING_PATH)}`;

  const user = await getAuthenticatedUser(redirectPath);
  if (user.role !== JUDGE) redirect(DASHBOARD_PATH);

  const projectsWithJudgingForm = await getAssignedProjectsWithJudgingForms(user.id);

  return <JudgingDisplay judgeId={user.id} projectsWithJudgingForm={projectsWithJudgingForm} />;
};

export default JudgingPage;
