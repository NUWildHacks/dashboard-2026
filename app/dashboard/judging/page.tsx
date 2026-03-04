import { redirect } from "next/navigation";

import { DASHBAORD_JUDGING_PATH, DASHBOARD_PATH, JUDGE, LOGIN_PATH } from "@/constants";
import { getAuthenticatedUser } from "@/lib";

import { JudgingForm } from "./_components";

const JudgingPage = async () => {
  const redirectPath = `${LOGIN_PATH}?redirect=${encodeURIComponent(DASHBAORD_JUDGING_PATH)}`;

  const user = await getAuthenticatedUser(redirectPath);
  if (user.role !== JUDGE) redirect(DASHBOARD_PATH);

  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-md font-semibold">Assigned Projects</h2>
        <p>¯\_(ツ)_/¯</p>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-md font-semibold">Judging Form</h2>
        <JudgingForm {...user} assignedProjects={[]} />
      </div>
    </div>
  );
};

export default JudgingPage;
