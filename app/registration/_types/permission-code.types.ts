import { PERMISSION_CODE_TYPES } from "@/app/dashboard/permission-codes/_constants/permission-codes.constants";
import type { User } from "@/types";

export type PermissionCodeType = (typeof PERMISSION_CODE_TYPES)[number];

export type PermissionCode = {
  id: string;
  email: User["email"];
  type: PermissionCodeType;
  created_at: number;
  expires_at: number;
};
