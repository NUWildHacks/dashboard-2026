import type { User } from "@/types";

export type PermissionCode = {
  id: string;
  email: User["email"];
  created_at: number;
  expires_at: number;
};
