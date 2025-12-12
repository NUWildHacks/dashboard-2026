import BaseModel from "@/types/base-model.types";

export type Project = BaseModel & {
  name: string;
  description: string;

  join_code: string;

  github_url: string;

  submitted_at?: number;
};
