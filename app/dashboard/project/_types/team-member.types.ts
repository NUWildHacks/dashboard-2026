import User from "@/types/user.types";

export type TeamMember = Pick<User, "id" | "first_name" | "last_name" | "github_username" | "email">;
