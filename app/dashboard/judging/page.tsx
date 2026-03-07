import { redirect } from "next/navigation";

import { DASHBOARD_JUDGING_PATH, DASHBOARD_PATH, JUDGE, LOGIN_PATH } from "@/constants";
import { getAuthenticatedUser } from "@/lib";

import { AssignedProjectsDisplay } from "./_components";
import { getAssignedProjects } from "./lib";

const JudgingPage = async () => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_JUDGING_PATH)}`;

  const user = await getAuthenticatedUser(redirectPath);
  if (user.role !== JUDGE) redirect(DASHBOARD_PATH);

  const assignedProjects = await getAssignedProjects(user.id);

  return (
    <AssignedProjectsDisplay assignedProjects={assignedProjects} />
  );
};

export default JudgingPage;
