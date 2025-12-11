import User from "@/types/user";

export type Project = {
  id: string;

  name: string;
  description: string;

  join_code: string;
  members: User["id"][];

  github_url?: string;

  created_at: number;
  updated_at: number;
  submitted_at?: number;
};
