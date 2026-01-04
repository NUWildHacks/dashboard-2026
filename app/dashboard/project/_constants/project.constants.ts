import { Project } from "../_types/project.types";

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
