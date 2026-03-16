import type { JudgingAssignment, JudgingForm, Project } from "./types";

export const AI_TRACK = "Artificial Intelligence" as const;
export const WEB_TRACK = "Web Development" as const;
export const FINTECH_TRACK = "Fintech" as const;
export const PRODUCTIVITY_TRACK = "Productivity" as const;

export const TRACKS = [AI_TRACK, WEB_TRACK, FINTECH_TRACK, PRODUCTIVITY_TRACK] as const;

export const JUDGING_FORM_FIELDS = {
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
  judging_form: "judging_form",
} as const satisfies Record<keyof Omit<JudgingAssignment, "id">, string>;
