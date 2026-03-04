import type { JudgingForm } from "./types";

export const JUDGING_FORM_FIELDS = {
  judge_id: "judge_id",
  judge_first_name: "judge_first_name",
  judge_last_name: "judge_last_name",
  project_id: "project_id",
  project_name: "project_name",
  project_link: "project_link",
  technical_complexity: "technical_complexity",
  usefulness: "usefulness",
  originality: "originality",
  design: "design",
  presentation: "presentation",
  comments: "comments",
  created_at: "created_at",
  updated_at: "updated_at",
} as const satisfies Record<keyof Omit<JudgingForm, "id">, string>;
