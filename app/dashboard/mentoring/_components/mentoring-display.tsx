import { JudgeAndMentorUser } from "@/types";

import { MentoringTimeslotRadioGroup } from ".";

type MentoringDisplayProps = Pick<JudgeAndMentorUser, "mentoring_timeslot" | "modality" | "other_modality">;

const MentoringDisplay = ({ mentoring_timeslot, modality, other_modality }: MentoringDisplayProps) => {
  return (
    <div className="flex-1 flex flex-col gap-6">
      <MentoringTimeslotRadioGroup
        mentoring_timeslot={mentoring_timeslot}
        modality={modality}
        other_modality={other_modality}
      />
    </div>
  );
};

export default MentoringDisplay;
