import { STATES } from "@/constants/wildhacks.constants";

export type WildHacksConfig = {
  state: (typeof STATES)[number];

  max_team_size: number;

  started_at: number | null;
  duration: number;

  updated_at: number;
};

export type WildHacksStatistics = {
  participants: number;
  judges: number;
  admins: number;
  projects: number;
  submissions: number;

  updated_at: number;
};
