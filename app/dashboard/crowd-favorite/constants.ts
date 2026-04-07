export const CROWD_FAVORITE_OPT_IN_START = 1775523000000; // Apr 6, 2026 8:00 PM CDT
export const CROWD_FAVORITE_OPT_IN_END = 1775529000000; // Apr 6, 2026 9:39 PM CDT

export const CROWD_FAVORITE_VOTING_START = 1775529000000; // Apr 6, 2026 9:40 PM CDT
export const CROWD_FAVORITE_VOTING_END = 1775529900000; // Apr 6, 2026 9:45 PM CDT

export const CROWD_FAVORITE_MAX_TEAM_MEMBERS = 4;
export const CROWD_FAVORITE_MAX_ADDITIONAL_MEMBERS = CROWD_FAVORITE_MAX_TEAM_MEMBERS - 1;

export const isCrowdFavoriteOptInOpen = (now = Date.now()) => {
  return now >= CROWD_FAVORITE_OPT_IN_START && now <= CROWD_FAVORITE_OPT_IN_END;
};

export const isCrowdFavoriteVotingOpen = (now = Date.now()) => {
  return now >= CROWD_FAVORITE_VOTING_START && now <= CROWD_FAVORITE_VOTING_END;
};

export const isCrowdFavoriteVotingClosed = (now = Date.now()) => {
  return now > CROWD_FAVORITE_VOTING_END;
};

export const isCrowdFavoritePresentationPhase = (now = Date.now()) => {
  return now > CROWD_FAVORITE_OPT_IN_END && now < CROWD_FAVORITE_VOTING_START;
};
