import User from "@/types/user.types";

type PermissionCode = {
  email: User["email"];
  expires_at: number;
};

export default PermissionCode;
