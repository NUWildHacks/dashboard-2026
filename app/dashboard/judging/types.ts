import { BaseModel, JudgeUser } from "@/types";

import { JudgingFormSchema } from "./_schemas";
import { TRACKS } from "./constants";

export type JudgingForm = BaseModel & JudgingFormSchema;

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
