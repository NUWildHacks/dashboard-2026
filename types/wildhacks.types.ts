export type TeamMatchingMode = "dev" | "prod";

export type WildHacksConfig = {
  max_team_size: number;
  max_participants: number;

  registration_deadline: number;
  start_time: number;
  submission_deadline: number;
  end_time: number;

  crowd_favorite_opt_in_started: boolean;
  crowd_favorite_opt_in_open: boolean;
  crowd_favorite_voting_started: boolean;
  crowd_favorite_voting_open: boolean;

  updated_at: number;
  results_released?: boolean;
  results_released_dev?: boolean;
  team_matching_mode?: TeamMatchingMode;
};

export type WildHacksSecrets = {
  crowd_favorite_password: string;
};

export type WildHacksStatistics = {
  participants: number;
  judges: number;
  mentors: number;
  admins: number;
  projects: number;
  submissions: number;
};
