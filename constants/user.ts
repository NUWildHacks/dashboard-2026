import countries from "@/data/countries.json";
import dietaryRestrictions from "@/data/dietary-restrictions.json";
import fieldsOfStudy from "@/data/fields-of-study.json";
import genders from "@/data/genders.json";
import levelsOfStudy from "@/data/levels-of-study.json";
import races from "@/data/races.json";
import schools from "@/data/schools.json";
import tshirtSizes from "@/data/tshirt-sizes.json";

export const COUNTRIES = countries;
export const SCHOOLS = schools;
export const LEVELS_OF_STUDY = levelsOfStudy;
export const FIELDS_OF_STUDY = fieldsOfStudy;
export const TSHIRT_SIZES = tshirtSizes;
export const GENDERS = genders;
export const RACES = races;
export const DIETARY_RESTRICTIONS = dietaryRestrictions;

export const PARTICIPANT = "Participant" as const;
export const JUDGE = "Judge" as const;
export const ADMIN = "Admin" as const;
export const ROLES = [PARTICIPANT, JUDGE, ADMIN] as const;

export const ATTENDING = "Attending" as const;
export const DROPPED = "Dropped" as const;
export const STATUSES = [ATTENDING, DROPPED] as const;
