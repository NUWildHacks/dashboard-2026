import { BaseModel, JudgeUser } from "@/types";

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
  description?: string;

  track?: string;

  try_it_out_url?: string;
  video_demo_url?: string;
  submittion_url?: string;

  submitted_at?: number;
  created_at?: number;
};
