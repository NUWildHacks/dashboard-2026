import { TeamMember } from "../_types/team-member.types";

export const TEAM_MEMBER_FIELDS = {
  first_name: "first_name",
  last_name: "last_name",
  github_username: "github_username",
  email: "email",
} as const satisfies Record<keyof Omit<TeamMember, "id">, string>;
