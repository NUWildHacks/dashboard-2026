import type { Timestamp } from "firebase/firestore";

export type User = {
  id: string;

  email: string;
  first_name: string;
  last_name: string;
  github_username: string;
  date_of_birth: Timestamp;
  phone: string;
  country: string;
  school: string;
  level_of_study: string;
  field_of_study: string;
  tshirt_size: string;

  gender: string;
  race: string;
  dietary_restrictions: string;
  other_dietary_restrictions: string;

  mlh_code_of_conduct: boolean;
  mlh_privacy_policy: boolean;
  mlh_marketing: boolean;

  role: "Participant" | "Judge" | "Admin";
  status: "Attending" | "Dropped";

  project_id?: string;
  checked_in?: boolean;
  checked_in_at?: Timestamp;
  dropped_at?: Timestamp;

  created_at: Timestamp;
  updated_at: Timestamp;
};
