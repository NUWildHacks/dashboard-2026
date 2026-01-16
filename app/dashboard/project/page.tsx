import { redirect } from "next/navigation";

import { EditProjectForm, EmptyProject, TeamMembersList } from "@/app/dashboard/project/_components";
import { getProjectDocSnapshot } from "@/app/dashboard/project/_lib";
import type { Project } from "@/app/dashboard/project/_types";
import { DASHBOARD_PROJECT_PATH, LOGIN_PATH, REGISTRATION_PATH } from "@/constants";
import { getUserDocSnapshot, verifySession } from "@/lib";
import type { User } from "@/types";

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

  const project: Project = { id: project_id!, ...(projectDocSnapshot.data() as Omit<Project, "id">) };

  return (
    <div className="flex-1 flex flex-col lg:flex-row lg:items-start gap-4">
      <EditProjectForm project={project} />
      <TeamMembersList userId={userId} {...project} />
    </div>
  );
};

export default ProjectPage;
