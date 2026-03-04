import { BaseModel, JudgeUser } from "@/types";

import { Project } from "../project/types";

export type JudgingForm = BaseModel & {
  judge_id: JudgeUser["id"];
  judge_first_name: JudgeUser["first_name"];
  judge_last_name: JudgeUser["last_name"];

  project_id: Project["id"];
  project_name: Project["name"];
  project_link: Project["github_url"];

  technical_complexity: number;
  usefulness: number;
  originality: number;
  design: number;
  presentation: number;
  comments: string;
};
