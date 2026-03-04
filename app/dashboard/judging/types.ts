import { BaseModel } from "@/types";

export type JudgingForm = BaseModel & {
  project_id: string;
  project_name: string;
  project_link: string;
  technical_complexity: number;
  usefulness: number;
  originality: number;
  design: number;
  presentation: number;
  comments: string;
};
