import type { JudgingForm, Project } from "./types";

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
  description: "description",
  track: "track",
  try_it_out_url: "try_it_out_url",
  video_demo_url: "video_demo_url",
  submittion_url: "submittion_url",
  submitted_at: "submitted_at",
  created_at: "created_at",
} as const satisfies Record<keyof Omit<Project, "id">, string>;
