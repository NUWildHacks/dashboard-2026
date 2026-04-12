import { redirect } from "next/navigation";

import { DASHBOARD_JUDGING_ROUND_1_PATH } from "@/constants";

const JudgingPage = () => {
  redirect(DASHBOARD_JUDGING_ROUND_1_PATH);
};

export default JudgingPage;
