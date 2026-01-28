import { PERMISSION_CODE_TYPE_MAP } from "@/app/dashboard/manage-users/_constants/permission-codes.constants";
import type { User } from "@/types";

export type PermissionCodeType = (typeof PERMISSION_CODE_TYPE_MAP)[number];

export type PermissionCode = {
  id: string;
  email: User["email"];
  type: PermissionCodeType;
  created_at: number;
  expires_at: number;
};
