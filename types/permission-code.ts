import User from "./user";

type PermissionCode = {
  email: User["email"];
  expires_at: number;
};

export default PermissionCode;
