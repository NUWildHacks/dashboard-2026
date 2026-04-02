import { redirect } from "next/navigation";

import { DASHBOARD_MENTORING_PATH, DASHBOARD_PATH, JUDGE_AND_MENTOR, LOGIN_PATH } from "@/constants";
import { getAuthenticatedUser } from "@/lib";

const MentoringPage = async () => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBOARD_MENTORING_PATH)}`;

  const user = await getAuthenticatedUser(redirectPath);
  if (user.role !== JUDGE_AND_MENTOR) redirect(DASHBOARD_PATH);

  return <div>MentoringPage</div>;
};

export default MentoringPage;
