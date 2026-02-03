import countries from "@/data/countries.json";
import dietaryRestrictions from "@/data/dietary-restrictions.json";
import fieldsOfStudy from "@/data/fields-of-study.json";
import genders from "@/data/genders.json";
import levelsOfStudy from "@/data/levels-of-study.json";
import races from "@/data/races.json";
import schools from "@/data/schools.json";
import tshirtSizes from "@/data/tshirt-sizes.json";
import type { ParticipantUser, AdminUser, JudgeUser } from "@/types/user.types";

export const COUNTRIES = countries;
export const SCHOOLS = schools;
export const LEVELS_OF_STUDY = levelsOfStudy;
export const FIELDS_OF_STUDY = fieldsOfStudy;
export const TSHIRT_SIZES = tshirtSizes;
export const GENDERS = genders;
export const RACES = races;
export const DIETARY_RESTRICTIONS = dietaryRestrictions;

export const MODALITIES = ["In-Person", "Remote"] as const;

export const PARTICIPANT = "Participant" as const;
export const JUDGE = "Judge" as const;
export const ADMIN = "Admin" as const;
export const ROLES = [PARTICIPANT, JUDGE, ADMIN] as const;

export const PARTICIPANT_USER_FIELDS = {
  email: "email",
  first_name: "first_name",
  last_name: "last_name",
  age: "age",
  phone: "phone",
  country: "country",
  school: "school",
  level_of_study: "level_of_study",
  field_of_study: "field_of_study",
  github_username: "github_username",
  tshirt_size: "tshirt_size",
  gender: "gender",
  race: "race",
  dietary_restrictions: "dietary_restrictions",
  other_dietary_restrictions: "other_dietary_restrictions",
  mlh_code_of_conduct: "mlh_code_of_conduct",
  mlh_privacy_policy: "mlh_privacy_policy",
  mlh_marketing: "mlh_marketing",
  role: "role",
  project_id: "project_id",
  joined_project_at: "joined_project_at",
  created_at: "created_at",
  updated_at: "updated_at",
} as const satisfies Record<keyof Omit<ParticipantUser, "id">, string>;

export const ADMIN_USER_FIELDS = {
  email: "email",
  first_name: "first_name",
  last_name: "last_name",
  dietary_restrictions: "dietary_restrictions",
  other_dietary_restrictions: "other_dietary_restrictions",
  tshirt_size: "tshirt_size",
  role: "role",
  created_at: "created_at",
  updated_at: "updated_at",
} as const satisfies Record<keyof Omit<AdminUser, "id">, string>;

export const JUDGE_USER_FIELDS = {
  email: "email",
  first_name: "first_name",
  last_name: "last_name",
  dietary_restrictions: "dietary_restrictions",
  other_dietary_restrictions: "other_dietary_restrictions",
  tshirt_size: "tshirt_size",
  role: "role",
  affiliated_company: "affiliated_company",
  modality: "modality",
  assigned_project_ids: "assigned_project_ids",
  created_at: "created_at",
  updated_at: "updated_at",
} as const satisfies Record<keyof Omit<JudgeUser, "id">, string>;
