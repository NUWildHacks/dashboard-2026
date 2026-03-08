import { JudgeUser } from "@/types";

import { JudgingFormSchema } from "./_schemas";
import { TRACKS } from "./constants";

export type JudgingForm = JudgingFormSchema & {
  created_at: number;
  updated_at: number;
};

export type Project = {
  id: string;
  name: string;
  track: (typeof TRACKS)[number];
  project_url: string;
};

export type JudgingAssignment = {
  id: string;
  judge_id: JudgeUser["id"];
  project_id: Project["id"];

  judging_form?: JudgingForm;
};

export type ProjectWithJudgingForm = Project & {
  judging_form?: JudgingAssignment["judging_form"];
};
