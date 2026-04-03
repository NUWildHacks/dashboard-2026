"use client";

import { JudgeAndMentorUser } from "@/types";

import { MentoringTimeslotRadioGroup } from ".";

type MentoringDisplayProps = Pick<JudgeAndMentorUser, "mentoring_timeslot">;

const MentoringDisplay = ({ mentoring_timeslot }: MentoringDisplayProps) => {
  return (
    <div className="flex-1 flex flex-col gap-6">
      <MentoringTimeslotRadioGroup mentoring_timeslot={mentoring_timeslot} />
    </div>
  );
};

export default MentoringDisplay;
