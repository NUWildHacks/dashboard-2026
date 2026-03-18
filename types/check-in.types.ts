import type { ActionResult } from "./action-result.types";
import type { BaseModel } from "./base-model.types";
import type { Role } from "./user.types";

export type QRCodeScanPayload = {
  user_id: string;
  email?: string;
  role?: Role;
  issued_at?: number;
};

export type EventCheckIn = BaseModel & {
  event_id: string;
  user_id: string;
  checked_in_at: number;
  checked_in_by: string;
  scan_payload: QRCodeScanPayload;
};

export type MealExchange = BaseModel & {
  event_id: string;
  user_id: string;
  exchanged_at: number;
  exchanged_by: string;
  scan_payload: QRCodeScanPayload;
};

export type CheckInActionResponse = ActionResult & {
  check_in?: EventCheckIn;
  already_checked_in?: boolean;
};

export type MealExchangeActionResponse = ActionResult & {
  meal_exchange?: MealExchange;
  already_exchanged?: boolean;
};

export type GetEventCheckInsActionResponse = ActionResult & {
  check_ins?: EventCheckIn[];
};

export type GetMealExchangesActionResponse = ActionResult & {
  meal_exchanges?: MealExchange[];
};
