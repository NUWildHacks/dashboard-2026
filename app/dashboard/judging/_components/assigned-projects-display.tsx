"use client";

import { useItemDialog } from "@/hooks";
import { JudgeUser } from "@/types";

import { Project } from "../types";

import { AssignedProjectItem, JudgingForm } from ".";

type AssignedProjectsDisplayProps = {
  judgeData: Pick<JudgeUser, "id" | "first_name" | "last_name">;
  assignedProjects: Project[];
};

const AssignedProjectsDisplay = ({ assignedProjects, judgeData }: AssignedProjectsDisplayProps) => {
  const useItemDialogReturn = useItemDialog<Project>(assignedProjects, "project");

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {assignedProjects.map((project) => (
          <AssignedProjectItem key={project.id} {...useItemDialogReturn} {...project} />
        ))}
      </div>
      <JudgingForm judgeData={judgeData} {...useItemDialogReturn} />
    </>
  );
};

export default AssignedProjectsDisplay;
