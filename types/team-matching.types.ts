export type TeamMatchingRunStatus = "draft" | "published";

export type TeamMatchingSettings = {
  default_team_size: 4;
  enforce_mutual_requirement: boolean;
  where_to_meet: string;
  weight_role_diversity: number;
  weight_work_style: number;
  weight_skills_complementarity: number;
  weight_experience_mix: number;
  weight_gender_preference: number;
  weight_proximity: number;
  weight_size_preference: number;
  updated_at: number;
};

export const DEFAULT_TEAM_MATCHING_SETTINGS: TeamMatchingSettings = {
  default_team_size: 4,
  enforce_mutual_requirement: true,
  where_to_meet: "",
  weight_role_diversity: 0.25,
  weight_work_style: 0.2,
  weight_skills_complementarity: 0.25,
  weight_experience_mix: 0.15,
  weight_gender_preference: 0.075,
  weight_proximity: 0.075,
  weight_size_preference: 0.05,
  updated_at: 0,
};

export type TeamMatchingRunWarning = {
  type: "oversized_cluster" | "no_technical_member" | "missing_teammate";
  user_ids: string[];
  message: string;
};

export type TeamMatchingRunStats = {
  total_participants: number;
  total_teams: number;
  unmatched_count: number;
  required_cluster_count: number;
  invalid_cluster_count: number;
};

export type TeamMatchingRun = {
  id: string;
  run_at: number;
  run_by: string;
  status: TeamMatchingRunStatus;
  settings_snapshot: TeamMatchingSettings;
  warnings: TeamMatchingRunWarning[];
  stats: TeamMatchingRunStats;
};

export type TeamMember = {
  user_id: string;
  name: string;
  roles: string[];
  skills: Record<string, number>;
  experience_level: string;
  work_style: string;
  gender_preference: string;
  where_staying: string;
};

export type MatchedTeam = {
  id: string;
  run_id: string;
  members: TeamMember[];
  score: number;
  match_reasons: string[];
  where_to_meet: string;
  notes: string[];
};

export type TeamSuggestion = {
  rank: 1 | 2 | 3;
  team_id: string;
  members: TeamMember[];
  score: number;
  match_reasons: string[];
  where_to_meet: string;
};

export type UserSuggestions = {
  user_id: string;
  run_id: string;
  suggestions: TeamSuggestion[];
};

export type IntakeRecord = {
  user_id: string;
  name: string;
  experience_level: string;
  preferred_roles: string[];
  skills: Record<string, number>;
  work_style: string;
  preferred_team_size: number;
  required_teammates: string[];
  additional_notes: string;
  gender_preference: string;
  where_staying: string;
};
