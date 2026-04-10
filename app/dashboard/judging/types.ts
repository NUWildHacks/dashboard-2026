import { JudgeUser } from "@/types";

import { JudgingFormSchema } from "./_schemas";
import { ROOMS, SUBMISSION_STATUSES, TRACKS } from "./constants";

export type Track = (typeof TRACKS)[number];

export type Room = (typeof ROOMS)[number];

export type JudgingForm = JudgingFormSchema & {
  created_at: number;
  updated_at: number;
};

export type Project = {
  id: string;
  name: string;
  track: Track;
  devpost_url: string;
};

export type JudgingAssignment = {
  id: string;
  judge_id: JudgeUser["id"];
  project_id: Project["id"];

  order: number;
  judging_round: number;
  room_id: Room;

  judging_form?: JudgingForm;
};

export type JudgingAssignmentWithProject = JudgingAssignment & {
  project: Project;
};

export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];
