import { PermissionCode } from "@/app/registration/_types";
import { ONE_DAY } from "@/constants";

export const LATE_REGISTRATION = "late_registration" as const;
export const JUDGE_REGISTRATION = "judge_registration" as const;
export const PERMISSION_CODE_TYPES = [LATE_REGISTRATION, JUDGE_REGISTRATION] as const;

export const PERMISSION_CODE_TYPE_MAP: Record<string, string> = {
  late_registration: "Late Registration",
  judge_registration: "Judge Registration",
} as const;

export const MOCK_PERMISSION_CODES: PermissionCode[] = [
  {
    id: "1",
    email: "test@test.com",
    type: LATE_REGISTRATION,
    expires_at: 1717334400000 + ONE_DAY,
    created_at: 1717334400000,
  },
  {
    id: "2",
    email: "test2@test.com",
    type: LATE_REGISTRATION,
    expires_at: 1717334400000 + ONE_DAY,
    created_at: 1717334400000,
  },
  {
    id: "3",
    email: "test3@test.com",
    type: JUDGE_REGISTRATION,
    expires_at: 1717334400000 + ONE_DAY,
    created_at: 1717334400000,
  },
] as const;
