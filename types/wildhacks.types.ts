export type WildHacksConfig = {
  max_team_size: number;
  max_participants: number;

  registration_deadline: number;
  start_time: number;
  end_time: number;

  crowd_favorite_password: string;
  crowd_favorite_opt_in_start: number;
  crowd_favorite_opt_in_end: number;
  crowd_favorite_voting_start: number;
  crowd_favorite_voting_end: number;

  updated_at: number;
};

export type WildHacksStatistics = {
  participants: number;
  judges: number;
  mentors: number;
  admins: number;
  projects: number;
  submissions: number;
};
