import type { Project, TeamMember } from "./types";

export const TEAM_MEMBER_FIELDS = {
  first_name: "first_name",
  last_name: "last_name",
  github_username: "github_username",
  email: "email",
} as const satisfies Record<keyof Omit<TeamMember, "id">, string>;

export const PROJECT_FIELDS = {
  name: "name",
  description: "description",
  owner_id: "owner_id",
  invitation_code: "invitation_code",
  github_url: "github_url",
  demo_url: "demo_url",
  created_at: "created_at",
  updated_at: "updated_at",
  submitted_at: "submitted_at",
} as const satisfies Record<keyof Omit<Project, "id">, string>;
