import { redirect } from "next/navigation";

import { EditProjectForm, EmptyProject, TeamMembersList } from "@/app/dashboard/project/_components";
import { DASHBOARD_PATH, DASHBOARD_PROJECT_PATH, LOGIN_PATH, PARTICIPANT } from "@/constants";
import { getAuthenticatedUser } from "@/lib";
import type { ParticipantUser } from "@/types";

import { getProject } from "./lib";

const ProjectPage = async () => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PROJECT_PATH)}`;

  const user = await getAuthenticatedUser(redirectPath);
  if (user.role !== PARTICIPANT) redirect(DASHBOARD_PATH);

  const { id: userId, project_id } = user as ParticipantUser;
  const project = await getProject(project_id);

  if (!project) {
    return <EmptyProject />;
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row lg:items-start gap-4">
      <EditProjectForm project={project} />
      <TeamMembersList userId={userId} {...project} />
    </div>
  );
};

export default ProjectPage;
