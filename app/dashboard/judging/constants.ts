import type { JudgingAssignment, JudgingForm, Project } from "./types";

export const PAST_TRACK = "Past" as const;
export const PRESENT_TRACK = "Present" as const;
export const FUTURE_TRACK = "Future" as const;

export const TRACKS = [PAST_TRACK, PRESENT_TRACK, FUTURE_TRACK] as const;

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
  devpost_url: "devpost_url",
} as const satisfies Record<keyof Omit<Project, "id">, string>;

export const JUDGING_ASSIGNMENT_FIELDS = {
  judge_id: "judge_id",
  project_id: "project_id",
  judging_form: "judging_form",
} as const satisfies Record<keyof Omit<JudgingAssignment, "id">, string>;
