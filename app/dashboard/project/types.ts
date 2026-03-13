import type { BaseModel, ParticipantUser, User } from "@/types";

export type TeamMember = Pick<ParticipantUser, "id" | "first_name" | "last_name" | "github_username" | "email">;

export type Project = BaseModel & {
  name: string;
  description: string;

  owner_id: User["id"];
  invitation_code: string;

  github_url: string;
  demo_url: string;

  submitted_at?: number;
};
