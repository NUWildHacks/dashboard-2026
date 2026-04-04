import { JudgeAndMentorUser } from "@/types";

import { MentoringTimeslotRadioGroup } from ".";

type MentoringDisplayProps = Pick<JudgeAndMentorUser, "mentoring_timeslot" | "modality">;

const MentoringDisplay = ({ mentoring_timeslot, modality }: MentoringDisplayProps) => {
  return (
    <div className="flex-1 flex flex-col gap-6">
      <MentoringTimeslotRadioGroup mentoring_timeslot={mentoring_timeslot} modality={modality} />
    </div>
  );
};

export default MentoringDisplay;
