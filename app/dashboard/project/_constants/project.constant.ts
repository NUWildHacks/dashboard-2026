import { Project } from "../_types/project.type";

export const PROJECT_FIELDS = {
  name: "name",
  description: "description",
  join_code: "join_code",
  members: "members",
  github_url: "github_url",
  created_at: "created_at",
  updated_at: "updated_at",
  submitted_at: "submitted_at",
} as const satisfies Record<keyof Omit<Project, "id">, string>;
