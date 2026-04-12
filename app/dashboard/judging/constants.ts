import rooms from "@/data/rooms.json";

import { JudgingAssignment, JudgingForm, Project, Track } from "./types";

export const PAST_TRACK = "Past" as const;
export const PRESENT_TRACK = "Present" as const;
export const FUTURE_TRACK = "Future" as const;
export const TRACKS = [PAST_TRACK, PRESENT_TRACK, FUTURE_TRACK] as const;

export const ROOMS = rooms;

export const SUBMITTED_STATUS = "Submitted" as const;
export const NOT_SUBMITTED_STATUS = "Not submitted" as const;
export const SUBMISSION_STATUSES = [SUBMITTED_STATUS, NOT_SUBMITTED_STATUS] as const;

export const ROUND_1 = "Round 1" as const;
export const ROUND_2 = "Round 2" as const;
export const ROUNDS = [ROUND_1, ROUND_2] as const;

export const TRACKS_MAP = {
  [PAST_TRACK]: "Childhood Games",
  [PRESENT_TRACK]: "Community",
  [FUTURE_TRACK]: "Data Storytelling",
} as const satisfies Record<Track, string>;

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
  order: "order",
  judging_round: "judging_round",
  room_id: "room_id",
} as const satisfies Record<keyof Omit<JudgingAssignment, "id">, string>;
