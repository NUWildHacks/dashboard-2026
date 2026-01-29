import type { ParticipantUser } from "@/types";

export type TeamMember = Pick<ParticipantUser, "id" | "first_name" | "last_name" | "github_username" | "email">;
