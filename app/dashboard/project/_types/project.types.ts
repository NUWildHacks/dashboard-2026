import BaseModel from "@/types/base-model.types";
import User from "@/types/user.types";

export type Project = BaseModel & {
  name: string;
  description: string;

  owner_id: User["id"];

  invitation_code: string;

  github_url: string;
  demo_url: string;

  submitted_at?: number;
};
