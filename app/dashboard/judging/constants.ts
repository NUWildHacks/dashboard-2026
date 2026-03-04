import type { JudgingForm } from "./types";

export const JUDGING_FORM_FIELDS = {
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
