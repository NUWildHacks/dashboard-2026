import { EditProjectForm, EmptyProject, TeamMembersList } from "@/app/dashboard/project/_components";
import { getProjectDocSnapshot } from "@/app/dashboard/project/_lib";
import type { Project } from "@/app/dashboard/project/_types";
import { DASHBOARD_PROJECT_PATH, LOGIN_PATH, PARTICIPANT } from "@/constants";
import { getAuthenticatedUser } from "@/lib";
import type { ParticipantUser } from "@/types";

const ProjectPage = async () => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PROJECT_PATH)}`;

  const user = await getAuthenticatedUser(redirectPath);
  if (user.role !== PARTICIPANT) {
    return <EmptyProject />;
  }

  const { id: userId, project_id } = user as ParticipantUser;
  const projectDocSnapshot = await getProjectDocSnapshot(project_id);

  if (!projectDocSnapshot || !projectDocSnapshot.exists) {
    return <EmptyProject />;
  }

  const project: Project = { id: project_id!, ...(projectDocSnapshot.data() as Omit<Project, "id">) };

  return (
    <div className="flex-1 flex flex-col lg:flex-row lg:items-start gap-4">
      <EditProjectForm project={project} />
      <TeamMembersList userId={userId} {...project} />
    </div>
  );
};

export default ProjectPage;
