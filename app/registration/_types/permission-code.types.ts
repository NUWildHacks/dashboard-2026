import type { User } from "@/types";

export type PermissionCode = {
  email: User["email"];
  expires_at: number;
};
