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
  ADMIN,
  JUDGE,
  MODALITIES,
  PARTICIPANT,
  JUDGE_AND_MENTOR,
  MENTORING_TIMESLOTS,
} from "@/constants";

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

export type MentoringTimeslot = (typeof MENTORING_TIMESLOTS)[number];

export type Role = (typeof ROLES)[number];

export type BaseUser = BaseModel & {
  first_name: string;
  last_name: string;
  email: string;
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

  crowd_favorite_project_id?: string;
  voted_for_project_id?: string;

  mlh_code_of_conduct: boolean;
  mlh_privacy_policy: boolean;
  mlh_marketing: boolean;
};

export type AdminUser = BaseUser & {
  role: typeof ADMIN;
};

export type JudgeUser = BaseUser & {
  role: typeof JUDGE;

  affiliated_company: string;
  modality: Modality;
  other_modality: string;

  onboarded?: boolean;
};

export type JudgeAndMentorUser = BaseUser & {
  role: typeof JUDGE_AND_MENTOR;

  affiliated_company: string;
  modality: Modality;
  other_modality: string;

  mentoring_timeslot: MentoringTimeslot;

  onboarded?: boolean;
};

export type User = ParticipantUser | AdminUser | JudgeUser | JudgeAndMentorUser;
