import type { JudgingAssignment, JudgingForm, Project } from "./types";

export const AI_TRACK = "Artificial Intelligence";
export const WEB_TRACK = "Web Development";
export const FINTECH_TRACK = "Fintech";
export const PRODUCTIVITY_TRACK = "Productivity";

export const TRACKS = [AI_TRACK, WEB_TRACK, FINTECH_TRACK, PRODUCTIVITY_TRACK];

export const JUDGING_FORM_FIELDS = {
  judge_id: "judge_id",
  judge_first_name: "judge_first_name",
  judge_last_name: "judge_last_name",
  project_id: "project_id",
  project_name: "project_name",
  technical_complexity: "technical_complexity",
  usefulness: "usefulness",
  originality: "originality",
  design: "design",
  presentation: "presentation",
  comments: "comments",
  created_at: "created_at",
  updated_at: "updated_at",
} as const satisfies Record<keyof Omit<JudgingForm, "id">, string>;

export const PROJECT_FIELDS = {
  name: "name",
  track: "track",
  project_url: "project_url",
} as const satisfies Record<keyof Omit<Project, "id">, string>;

export const JUDGING_ASSIGNMENT_FIELDS = {
  judge_id: "judge_id",
  project_id: "project_id",
} as const satisfies Record<keyof Omit<JudgingAssignment, "id">, string>;
