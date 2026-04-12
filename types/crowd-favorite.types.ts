import type { BaseModel } from "./base-model.types";
import type { ParticipantUser } from "./user.types";

export type CrowdFavoriteTeamMember = Pick<ParticipantUser, "id" | "first_name" | "email">;

export type CrowdFavoriteProject = BaseModel & {
  project_name: string;
  devpost_url: string;
  team_members: CrowdFavoriteTeamMember[];
  team_member_ids: string[];
};

/** Document at `/crowd_favorites/{crowd_favorite_project_id}/votes/{user_id}` */
export type Vote = {
  id: string;
  created_at: number;
};
