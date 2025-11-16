import { Timestamp } from "firebase/firestore";

import User from "./user";

type PermissionCode = {
  email: User["email"];
  expires_at: Timestamp;
};

export default PermissionCode;
