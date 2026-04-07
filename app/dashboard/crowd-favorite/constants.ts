import { getConfigDocSnapshot } from "@/lib";
import type { WildHacksConfig } from "@/types";

export const CROWD_FAVORITE_MAX_TEAM_MEMBERS = 4;
export const CROWD_FAVORITE_MAX_ADDITIONAL_MEMBERS = CROWD_FAVORITE_MAX_TEAM_MEMBERS - 1;

// Helper function to get config-based timing values
async function getCrowdFavoriteTimingConfig(): Promise<
  Pick<
    WildHacksConfig,
    | "crowd_favorite_opt_in_start"
    | "crowd_favorite_opt_in_end"
    | "crowd_favorite_voting_start"
    | "crowd_favorite_voting_end"
  >
> {
  const configDocSnapshot = await getConfigDocSnapshot();
  const config = configDocSnapshot.data() as WildHacksConfig;
  return {
    crowd_favorite_opt_in_start: config.crowd_favorite_opt_in_start,
    crowd_favorite_opt_in_end: config.crowd_favorite_opt_in_end,
    crowd_favorite_voting_start: config.crowd_favorite_voting_start,
    crowd_favorite_voting_end: config.crowd_favorite_voting_end,
  };
}

export const isCrowdFavoriteOptInOpen = async (config?: Partial<WildHacksConfig>): Promise<boolean> => {
  const timingConfig = config || (await getCrowdFavoriteTimingConfig());
  const now = Date.now();
  return now >= timingConfig.crowd_favorite_opt_in_start! && now <= timingConfig.crowd_favorite_opt_in_end!;
};

export const hasCrowdFavoriteOptInStarted = async (config?: Partial<WildHacksConfig>): Promise<boolean> => {
  const timingConfig = config || (await getCrowdFavoriteTimingConfig());
  const now = Date.now();
  return now >= timingConfig.crowd_favorite_opt_in_start!;
};

export const isCrowdFavoriteVotingOpen = async (config?: Partial<WildHacksConfig>): Promise<boolean> => {
  const timingConfig = config || (await getCrowdFavoriteTimingConfig());
  const now = Date.now();
  return now >= timingConfig.crowd_favorite_voting_start! && now <= timingConfig.crowd_favorite_voting_end!;
};

export const hasCrowdFavoriteVotingStarted = async (config?: Partial<WildHacksConfig>): Promise<boolean> => {
  const timingConfig = config || (await getCrowdFavoriteTimingConfig());
  const now = Date.now();
  return now >= timingConfig.crowd_favorite_voting_start!;
};

export const isCrowdFavoriteVotingClosed = async (config?: Partial<WildHacksConfig>): Promise<boolean> => {
  const timingConfig = config || (await getCrowdFavoriteTimingConfig());
  const now = Date.now();
  return now > timingConfig.crowd_favorite_voting_end!;
};

export const isCrowdFavoritePresentationPhase = async (config?: Partial<WildHacksConfig>): Promise<boolean> => {
  const timingConfig = config || (await getCrowdFavoriteTimingConfig());
  const now = Date.now();
  return now > timingConfig.crowd_favorite_opt_in_end! && now < timingConfig.crowd_favorite_voting_start!;
};
