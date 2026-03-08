"use client";

import { JudgeUser } from "@/types";

import { useJudgingFormSheet } from "../_hooks";
import type { ProjectWithJudgingForm } from "../types";

import { AssignedProjectItem, JudgingFormSheet } from ".";

type AssignedProjectsDisplayProps = {
  judgeId: JudgeUser["id"];
  projectsWithJudgingForm: ProjectWithJudgingForm[];
};

const AssignedProjectsDisplay = ({ judgeId, projectsWithJudgingForm }: AssignedProjectsDisplayProps) => {
  const useJudgingFormSheetReturn = useJudgingFormSheet(judgeId);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {projectsWithJudgingForm.map((projectWithJudgingForm) => (
          <AssignedProjectItem
            key={projectWithJudgingForm.id}
            {...useJudgingFormSheetReturn}
            projectWithJudgingForm={projectWithJudgingForm}
          />
        ))}
      </div>
      <JudgingFormSheet {...useJudgingFormSheetReturn} />
    </>
  );
};

export default AssignedProjectsDisplay;
