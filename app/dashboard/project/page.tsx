import { redirect } from "next/navigation";

import { DASHBOARD_PROJECT_PATH, LOGIN_PATH, REGISTRATION_PATH } from "@/constants/routes";
import { verifySession } from "@/lib/session";
import { getUserDocSnapshot } from "@/lib/user";
import { getConfigDocSnapshot } from "@/lib/wildhacks";
import User from "@/types/user";
import { WildHacksConfig } from "@/types/wildhacks";

import EmptyProject from "./_components/_empty_project/empty-project";
import { getProjectDocSnapshot } from "./_lib/project.lib";

const Project = async () => {
  const userId = await verifySession();
  if (!userId) redirect(`${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_PROJECT_PATH)}`);

  const userDocSnapshot = await getUserDocSnapshot(userId);
  if (!userDocSnapshot.exists) redirect(REGISTRATION_PATH);

  const configDocSnapshot = await getConfigDocSnapshot();
  const wildhacksConfig = configDocSnapshot.data() as WildHacksConfig;
  const { max_team_size } = wildhacksConfig;

  const projectId = (userDocSnapshot.data() as User).project_id;
  const projectDocSnapshot = await getProjectDocSnapshot(projectId);

  if (!projectDocSnapshot) {
    return <EmptyProject userId={userId} maxTeamSize={max_team_size} />;
  }

  return <></>;
};

export default Project;
