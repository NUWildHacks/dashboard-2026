import { BaseModel, JudgeUser } from "@/types";

import { TRACKS } from "./constants";

export type JudgingForm = BaseModel & {
  judge_id: JudgeUser["id"];
  judge_first_name: JudgeUser["first_name"];
  judge_last_name: JudgeUser["last_name"];

  project_id: Project["id"];
  project_name: Project["name"];

  technical_complexity: number;
  usefulness: number;
  originality: number;
  design: number;
  presentation: number;
  comments: string;
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
}
