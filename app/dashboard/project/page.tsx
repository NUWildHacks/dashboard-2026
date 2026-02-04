import { FolderGit2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { EditProjectForm, EmptyProject, TeamMembersList } from "@/app/dashboard/project/_components";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { DASHBOARD_PATH, DASHBOARD_PROJECT_PATH, LOGIN_PATH, PARTICIPANT } from "@/constants";
import { getAuthenticatedUser } from "@/lib";
import type { ParticipantUser } from "@/types";

import { getProject } from "./lib";

const ProjectPage = async () => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PROJECT_PATH)}`;

  const user = await getAuthenticatedUser(redirectPath);
  if (user.role !== PARTICIPANT) redirect(DASHBOARD_PATH);

  return (
    <div className="flex-1 flex justify-center items-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderGit2 />
          </EmptyMedia>
          <EmptyTitle>Project management coming soon</EmptyTitle>
          <EmptyDescription>
            Check back soon for updates. If you have any questions, please contact us at{" "}
            <Link href="mailto:wildhacks@northwestern.edu" className="underline underline-offset-4">
              wildhacks@northwestern.edu
            </Link>
            .
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );

  // const { id: userId, project_id } = user as ParticipantUser;
  // const project = await getProject(project_id);

  // if (!project) {
  //   return <EmptyProject />;
  // }

  // return (
  //   <div className="flex-1 flex flex-col lg:flex-row lg:items-start gap-4">
  //     <EditProjectForm project={project} />
  //     <TeamMembersList userId={userId} {...project} />
  //   </div>
  // );
};

export default ProjectPage;
