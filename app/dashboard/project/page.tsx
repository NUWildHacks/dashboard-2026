import { redirect } from "next/navigation";

import { DASHBOARD_PROJECT_PATH, LOGIN_PATH, REGISTRATION_PATH } from "@/constants/routes.constants";
import { verifySession } from "@/lib/session.lib";
import { getUserDocSnapshot } from "@/lib/user.lib";
import User from "@/types/user.types";

import EmptyProject from "./_components/_empty-project/empty-project";
import EditProjectForm from "./_components/edit-project-form";
import TeamMembers from "./_components/team-members";
import { getProjectDocSnapshot } from "./_lib/project.lib";
import { Project } from "./_types/project.types";

const ProjectPage = async () => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PROJECT_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);
  const { project_id } = userDocSnapshot.data() as Omit<User, "id">;

  const projectDocSnapshot = await getProjectDocSnapshot(project_id);

  if (!projectDocSnapshot || !projectDocSnapshot.exists) {
    return <EmptyProject userId={userId} />;
  }

  const projectData = projectDocSnapshot.data() as Omit<Project, "id">;
  const { invitation_code } = projectData;

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <EditProjectForm project={{ id: project_id!, ...projectData }} />
      <TeamMembers projectId={project_id!} invitationCode={invitation_code} />
    </div>
  );
};

export default ProjectPage;
