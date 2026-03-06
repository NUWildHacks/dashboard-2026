import { BaseModel, JudgeUser, User } from "@/types";

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

export type Project = BaseModel & {
  name: string;
  description: string;

  owner_id: User["id"];
  invitation_code: string;

  github_url: string;
  demo_url: string;

  submitted_at?: number;
};
