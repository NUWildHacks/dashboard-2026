import { BookX } from "lucide-react";

import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

import { UseJudgingFormSheetReturn } from "../_hooks";
import type { JudgingAssignmentWithProject } from "../types";

import { AssignedProjectItem } from ".";

type AssignedProjectListProps = {
  judgingAssignmentsWithProjects: JudgingAssignmentWithProject[];
} & Pick<UseJudgingFormSheetReturn, "handleOpenJudgingForm" | "handleKeyDown">;

const AssignedProjectList = ({
  judgingAssignmentsWithProjects,
  handleOpenJudgingForm,
  handleKeyDown,
}: AssignedProjectListProps) => {
  if (judgingAssignmentsWithProjects.length === 0) {
    return (
      <Empty role="status" aria-live="polite">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookX aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No assigned projects</EmptyTitle>
          <EmptyDescription>Could not find projects assigned to you. Check back later!</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {judgingAssignmentsWithProjects.map((judgingAssignmentWithProject) => (
        <AssignedProjectItem
          key={judgingAssignmentWithProject.id}
          handleOpenJudgingForm={handleOpenJudgingForm}
          handleKeyDown={handleKeyDown}
          judgingAssignmentWithProject={judgingAssignmentWithProject}
        />
      ))}
    </div>
  );
};

export default AssignedProjectList;
