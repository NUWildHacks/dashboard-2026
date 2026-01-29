import { Project } from "@/app/dashboard/project/_types/project.types";
import {
  COUNTRIES,
  DIETARY_RESTRICTIONS,
  FIELDS_OF_STUDY,
  GENDERS,
  LEVELS_OF_STUDY,
  RACES,
  ROLES,
  SCHOOLS,
  TSHIRT_SIZES,
} from "@/constants";
import { ADMIN, JUDGE, MODALITIES, PARTICIPANT } from "@/constants/user.constants";

import type { BaseModel } from "./base-model.types";

export type Country = (typeof COUNTRIES)[number];
export type School = (typeof SCHOOLS)[number];
export type LevelOfStudy = (typeof LEVELS_OF_STUDY)[number];
export type FieldOfStudy = (typeof FIELDS_OF_STUDY)[number];
export type TShirtSize = (typeof TSHIRT_SIZES)[number];
export type Gender = (typeof GENDERS)[number];
export type Race = (typeof RACES)[number];
export type DietaryRestriction = (typeof DIETARY_RESTRICTIONS)[number];
export type Modality = (typeof MODALITIES)[number];

export type Role = (typeof ROLES)[number];

export type BaseUser = BaseModel & {
  email: string;
  first_name: string;
  last_name: string;
  dietary_restrictions: DietaryRestriction[];
  other_dietary_restrictions: string;
  tshirt_size: TShirtSize;
};

export type ParticipantUser = BaseUser & {
  role: typeof PARTICIPANT;

  age: string;
  phone: string;
  country: Country;

  school: School;
  level_of_study: LevelOfStudy;
  field_of_study: FieldOfStudy;

  github_username: string;

  gender: Gender;
  race: Race;

  mlh_code_of_conduct: boolean;
  mlh_privacy_policy: boolean;
  mlh_marketing: boolean;

  project_id?: Project["id"];
  joined_project_at?: number;
};

export type AdminUser = BaseUser & {
  role: typeof ADMIN;
};

export type JudgeUser = BaseUser & {
  role: typeof JUDGE;

  affiliated_company: string;
  modality: Modality;

  assigned_project_id?: Project["id"];
};

export type User = ParticipantUser | AdminUser | JudgeUser;
