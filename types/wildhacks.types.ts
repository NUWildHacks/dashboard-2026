import { STATES } from "@/constants";

export type WildHacksConfig = {
  state: (typeof STATES)[number];

  max_team_size: number;

  start_time: number;
  end_time: number;

  updated_at: number;
};

export type WildHacksStatistics = {
  participants: number;
  judges: number;
  admins: number;
  projects: number;
  submissions: number;
};
