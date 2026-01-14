import type { User } from "@/types";

export type TeamMember = Pick<User, "id" | "first_name" | "last_name" | "github_username" | "email">;
