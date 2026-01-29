import { PermissionCode } from "@/app/dashboard/permission-codes/_types";
import { ONE_DAY } from "@/constants";

export const MOCK_PERMISSION_CODES: PermissionCode[] = [
  {
    id: "1",
    email: "test@test.com",
    expires_at: 1717334400000 + ONE_DAY,
    created_at: 1717334400000,
  },
  {
    id: "2",
    email: "test2@test.com",
    expires_at: 1717334400000 + ONE_DAY,
    created_at: 1717334400000,
  },
  {
    id: "3",
    email: "test3@test.com",
    expires_at: 1717334400000 + ONE_DAY,
    created_at: 1717334400000,
  },
] as const;
