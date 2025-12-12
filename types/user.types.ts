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
} from "@/constants/user.constants";

import BaseModel from "./base-model.types";

export type Country = (typeof COUNTRIES)[number];
export type School = (typeof SCHOOLS)[number];
export type LevelOfStudy = (typeof LEVELS_OF_STUDY)[number];
export type FieldOfStudy = (typeof FIELDS_OF_STUDY)[number];
export type TShirtSize = (typeof TSHIRT_SIZES)[number];
export type Gender = (typeof GENDERS)[number];
export type Race = (typeof RACES)[number];
export type DietaryRestriction = (typeof DIETARY_RESTRICTIONS)[number];

export type Role = (typeof ROLES)[number];

type User = BaseModel & {
  email: string;
  first_name: string;
  last_name: string;
  age: string;
  phone: string;
  country: Country;

  school: School;
  level_of_study: LevelOfStudy;
  field_of_study: FieldOfStudy;

  github_username: string;
  tshirt_size: TShirtSize;

  gender: Gender;
  race: Race;
  dietary_restrictions: DietaryRestriction[];
  other_dietary_restrictions: string;

  mlh_code_of_conduct: boolean;
  mlh_privacy_policy: boolean;
  mlh_marketing: boolean;

  role: Role;

  project_id?: string;
};

export default User;
